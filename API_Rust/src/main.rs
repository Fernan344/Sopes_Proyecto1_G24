#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use rocket::serde::json::Json;
use rocket::serde::{Serialize, Deserialize};

use chrono::prelude::*; 

use sqlx::mysql::MySqlPoolOptions;

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Carga {
    pub nombre: String,
    pub comentario: String,
    pub fecha: String,
    pub hashtags: Vec<String>,
    pub upvotes: usize,
    pub downvotes: usize
}


#[post("/add_tweet", data = "<carga>")]
async fn create(carga: Json<Carga>) -> String {
    let insert_result = insert_twit(carga).await;
    match insert_result {
        Ok(_) => String::from("Tweet Insertado"),
        Err(_) => String::from("No se pudo insertar el tweet"),
    }
    
}

async fn insert_twit(carga: Json<Carga>) -> Result<Json<Carga>, sqlx::Error>{
    println!("Insertando nuevo twit");
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect("mysql://root:31370599@localhost/twitter").await?;

    let strdate: &str = carga.fecha.as_str();
    let date = NaiveDate::parse_from_str(strdate, "%d/%m/%Y").unwrap();

    println!("Se insertara un tweet");
    let insert_twit = format!("INSERT INTO twit (nombre, comentario, fecha, upvotes, downvotes) VALUES ('{}', '{}', '{}', {}, {})",
        carga.nombre,
        carga.comentario,
        date,
        carga.upvotes,
        carga.downvotes
    );
    sqlx::query(insert_twit.as_str()).execute(&pool).await?; // Insertamos el nuevo twit
    println!("Tweet insertando, insertando los hashtags");

    let stream = sqlx::query!("SELECT MAX(id) as id FROM twit")
        .fetch_all(&pool)
        .await?;
    let id = stream[0].id.unwrap(); // Obtenemos el ultimo id creado

    println!("Insertando hashtag");
    for hashtag in &carga.hashtags {
        let insert_hashtag = format!("INSERT INTO hashtags (hashtag) VALUES ('{}')", hashtag);
        let query_result = sqlx::query(insert_hashtag.as_str()).execute(&pool).await;
        match query_result {
            Ok(_) => {
                // El ultimo hashtag insertado
                println!("se usara hashtag recien insertado");
                let lhi = sqlx::query!("SELECT MAX(id) as id FROM hashtags")
                    .fetch_all(&pool)
                    .await?;
                let lhip = lhi[0].id.unwrap();

                let insert_relation = format!("INSERT INTO hash_twit (idTwit, idHash) VALUES ({}, {})", id, lhip);
                sqlx::query(insert_relation.as_str()).execute(&pool).await?; // Insertamos la nueva relacion twit hashtag
            },
            Err(_) => {
                // Select de un hashtag existente
                println!("se usara hashtag ya existente");
                let hi = sqlx::query!("SELECT id FROM hashtags WHERE hashtag = ?", hashtag)
                    .fetch_all(&pool)
                    .await?;
                let hip = hi[0].id;

                let insert_relation = format!("INSERT INTO hash_twit (idTwit, idHash) VALUES ({}, {})", id, hip);
                sqlx::query(insert_relation.as_str()).execute(&pool).await?; // Insertamos la nueva relacion twit hashtag
            }
        }
    }
    Ok(carga)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/rust", routes![create])
}

/* async fn connect() -> Result<(), sqlx::Error>{
    println!("Entre aqui");
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect("mysql://root:31370599@localhost/twitter").await?;

    let stream = sqlx::query_as!(twit_id, "SELECT MAX(id) as id FROM twit")
        .fetch_all(&pool)
        .await?;

    let id = stream[0].id.unwrap();
    println!("{}", id);

    println!("Voy saliendo");

    sqlx::query("insert into twit (nombre, comentario, fecha, upvotes, downvotes) values ('Aldo Hernandez', 'b', STR_TO_DATE('16-09-2021', '%d-%m-%Y'), 11, 11)")
        .execute(&pool)
        .await?;

    Ok(())
}
 */

