package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	//"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type twit struct {
	Nombre     string   `json:nombre`
	Comentario string   `json:comentario`
	Fecha      string   `json:fecha`
	Hashtags   []string `json:hashtags`
	Upvotes    int      `json:upvotes`
	Downvotes  int      `json:downvotes`
}

func conexionDB() (conexion *sql.DB) {
	Driver := "mysql"
	Usuario := "root"
	Contrasenia := "josePJ64"
	Nombre := "twitter"

	conexion, err := sql.Open(Driver, Usuario+":"+Contrasenia+"@tcp(127.0.0.1)/"+Nombre)

	if err != nil {
		panic(err.Error())
	}

	return conexion
}

func indexRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome")
}

func publicar(w http.ResponseWriter, r *http.Request) {
	var newTwit twit
	reqBody, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Fprintf(w, "Insert a Valid Twit")
	}

	json.Unmarshal(reqBody, &newTwit)

	fechaParts := strings.Split(newTwit.Fecha, "/")
	newFecha := fechaParts[2] + "-" + fechaParts[1] + "-" + fechaParts[0]
	newTwit.Fecha = newFecha

	fmt.Println(newTwit.Hashtags)

	conexion := conexionDB()
	insertarRegistros, err := conexion.Prepare("INSERT INTO TWIT(nombre, comentario, fecha, upvotes, downvotes, api) VALUES(?,?,?,?,?,'go')")
	if err != nil {
		panic(err)
	}

	resultado, err := insertarRegistros.Exec(newTwit.Nombre, newTwit.Comentario, newTwit.Fecha, newTwit.Upvotes, newTwit.Downvotes)

	if err != nil {
		fmt.Println(resultado)
		panic(err)
	}

	registro, err := conexion.Query("SELECT MAX(id) FROM twit")

	if err != nil {
		panic(err)
	}

	var idTwit int

	for registro.Next() {
		err = registro.Scan(&idTwit)
		if err != nil {
			panic(err)
		}
	}

	for i := 0; i < len(newTwit.Hashtags); i++ {
		hashtag := newTwit.Hashtags[i]
		insertarHashtag, err := conexion.Prepare("INSERT INTO hashtags (hashtag) VALUES (?)")

		if err != nil {
			registroIdHashtag, err := conexion.Query("SELECT id FROM hashtags WHERE hashtag = ?", hashtag)

			if err != nil {
				panic(err)
			}

			var idHash int
			for registroIdHashtag.Next() {
				err = registroIdHashtag.Scan(&idHash)
				if err != nil {
					panic(err)
				}
			}

			insertarTwitHash, err := conexion.Prepare("INSERT INTO hash_twit (idTwit, idHash) VALUES (?, ?)")
			if err != nil {
				panic(err)
			}
			resultado, err := insertarTwitHash.Exec(idTwit, idHash)
			if err != nil {
				fmt.Println(resultado)
				panic(err)
			}
		}

		insertarHashtag.Exec(hashtag)

		registroIdHashtag, err := conexion.Query("SELECT MAX(id) FROM hashtags")

		if err != nil {
			panic(err)
		}

		var idHash int
		for registroIdHashtag.Next() {
			err = registroIdHashtag.Scan(&idHash)
			if err != nil {
				panic(err)
			}
		}

		insertarTwitHash, err := conexion.Prepare("INSERT INTO hash_twit (idTwit, idHash) VALUES (?, ?)")
		if err != nil {
			panic(err)
		}
		resultado, err := insertarTwitHash.Exec(idTwit, idHash)

		if err != nil {
			fmt.Println(resultado)
			panic(err)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTwit)
}

func main() {

	fmt.Println("Hello Go")

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", indexRoute)
	router.HandleFunc("/publicar", publicar).Methods("POST")
	log.Fatal(http.ListenAndServe(":5000", router))
}
