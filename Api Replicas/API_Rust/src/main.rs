#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use rocket::serde::json::Json;
use rocket::serde::{Serialize, Deserialize};

use chrono::prelude::*; 

use sqlx::mysql::MySqlPoolOptions;
use mongodb::{Client, options::ClientOptions};

#[derive(Serialize, Deserialize)]
#[derive(Clone)]
#[serde(crate = "rocket::serde")]
pub struct Carga {
    pub nombre: String,
    pub comentario: String,
    pub fecha: String,
    pub hashtags: Vec<String>,
    pub upvotes: usize,
    pub downvotes: usize
}

#[get("/echo")]
fn echo() -> String{
    String::from("echo")
}

#[post("/add_tweet", data = "<carga>")]
async fn create(carga: Json<Carga>) -> String {
    // insertando primero en mysql
    let insert_result = insert_twit(carga.clone()).await;
    match insert_result {
        Ok(_) => {
            // se inserto en mysql, probamos a insertar en cosmos db
            let insert_cosmos_result = insert_twit_cosmos(carga.clone()).await;
            match insert_cosmos_result {
                Ok(_) => String::from("Tweet Insertado en todas la databases"),
                Err(_) => String::from("Tweet Insertado en mysql"),
            }
        },
        Err(_) => {
            // se inserto en mysql, probamos a insertar en cosmos db
            let insert_cosmos_result = insert_twit_cosmos(carga.clone()).await;
            match insert_cosmos_result {
                Ok(_) => String::from("Tweet Insertado en cosmosdb"),
                Err(_) =>  String::from("No se pudo insertar el tweet"),
            }
        },       
    }
    
}

async fn insert_twit_cosmos(carga: Json<Carga>) -> Result<Json<Carga>, mongodb::error::Error> {
    let client_options = ClientOptions::parse("mongodb://sopes1-g24-2021:kxeCcSywgmVVNUgN2vuDMPKwULZ01ZryPyJQm3R8SjfJeG2WB3pBd7BmwI8pA3nnd28No0gJIUOBLnK5JoNWdw==@sopes1-g24-2021.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@sopes1-g24-2021@").await?;
    let client = Client::with_options(client_options)?;
    let db = client.database("sopes1");

    let collection = db.collection::<Carga>("proyecto1");

    let new_doc = Carga {
        nombre: carga.nombre.clone(),
        comentario: carga.comentario.clone(),
        fecha: carga.fecha.clone(),
        hashtags: carga.hashtags.clone(),
        upvotes: carga.upvotes.clone(),
        downvotes: carga.downvotes.clone()
    };

    collection.insert_one(new_doc, None).await?;

    Ok(carga)
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
        .mount("/rust", routes![create, echo])
}
