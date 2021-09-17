package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func main() {
	// leer el arreglo de bytes del archivo
	jsonFile, err := os.Open("generated.json")

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	defer jsonFile.Close()

	datosComoBytes, _ := ioutil.ReadAll(jsonFile)

	var decoded []interface{}

	err = json.Unmarshal(datosComoBytes, &decoded)

	if err != nil {
		fmt.Println(err.Error())
	}

	for i := 0; i < len(decoded); i++ {
		clienteHttp := &http.Client{}
		// Si quieres agregar parámetros a la URL simplemente haz una
		// concatenación :)
		url := "http://localhost:4500/add_tweet"

		tweetComoJson, err := json.Marshal(decoded[i])
		if err != nil {
			// Maneja el error de acuerdo a tu situación
			log.Fatalf("Error codificando usuario como JSON: %v", err)
		}

		peticion, err := http.NewRequest("POST", url, bytes.NewBuffer(tweetComoJson))
		if err != nil {
			// Maneja el error de acuerdo a tu situación
			log.Fatalf("Error creando petición: %v", err)
		}

		peticion.Header.Add("Content-Type", "application/json")
		peticion.Header.Add("X-Hola-Mundo", "Ejemplo")
		respuesta, err := clienteHttp.Do(peticion)

		if err != nil {
			// Maneja el error de acuerdo a tu situación
			log.Fatalf("Error haciendo petición: %v", err)
		}

		// No olvides cerrar el cuerpo al terminar
		defer respuesta.Body.Close()

		cuerpoRespuesta, err := ioutil.ReadAll(respuesta.Body)
		if err != nil {
			log.Fatalf("Error leyendo respuesta: %v", err)
		}

		respuestaString := string(cuerpoRespuesta)
		/*log.Printf("Código de respuesta: %d", respuesta.StatusCode)
		log.Printf("Encabezados: '%q'", respuesta.Header)
		contentType := respuesta.Header.Get("Content-Type")
		log.Printf("El tipo de contenido: '%s'", contentType)*/
		log.Printf("Cuerpo de respuesta del servidor: '%s'", respuestaString)
	}
}
