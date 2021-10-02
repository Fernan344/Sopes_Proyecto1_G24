package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"bytes"
	"strings"
	"time"

	"cloud.google.com/go/pubsub"
)

func publish(msg string) error {
	projectId := "proyecto1sopes-326001"
	topicId := "sopes1"
 
	ctx := context.Background()

	client, err := pubsub.NewClient(ctx, projectId)
	if err != nil {
		fmt.Print("Error :( ")
		fmt.Print(err)
		return fmt.Errorf("Error al conectarse %%v", err)
	}

	t := client.Topic(topicId)
	result := t.Publish(ctx, &pubsub.Message{Data: []byte(msg)})

	id, err := result.Get(ctx)
	if err != nil {
		fmt.Print("error")
		fmt.Print(err)
		return fmt.Errorf("Error: %v", err)
	}

	fmt.Print("Publicado: ", id)
	return nil
}

type Data struct {
	Api		   string `json:"api"`
}
type Publicar struct {
	Guardados     int `json:"guardados"`
	Api string`json:"api"`
	TiempoDeCarga      int`json:"tiempoDeCarga"`
	Db    string`json:"db"`

}
type contador struct {
	Cantidad     int `json:"cantidad"`
	Api string`json:"api"`


}
var dt time.Time;
var contadores [3]contador
func limpiar ()int{
	contadores[0].Cantidad=0;
	contadores[1].Cantidad=0;
	contadores[2].Cantidad=0;
	contadores[0].Api="Python";
	contadores[1].Api="Go";
	contadores[2].Api="Rust";
	return 1;
}
func fecha()int {
	dt2 :=time.Now();
	tiempo:= (dt2.Hour()-dt.Hour())*3600 + (dt2.Minute()-dt.Minute())*60+ (dt2.Second()-dt.Second());
	return tiempo;

}

func main() {
 
	fmt.Println("Iniciando envio...")
	limpiar();
	http.HandleFunc("/iniciarCarga", func(w http.ResponseWriter, r *http.Request) {
		limpiar();
		fmt.Fprintf(w, "iniciarCarga")
	})

	http.HandleFunc("/publicar", func(w http.ResponseWriter, r *http.Request) {
		
	if(contadores[0].Cantidad==0&&contadores[1].Cantidad==0&&contadores[2].Cantidad==0){dt = time.Now()}
		var d Data
		err:= json.NewDecoder(r.Body).Decode(&d)
		if err != nil {
			fmt.Print(err)
		} else {
			
			if(strings.ToLower(d.Api)=="python"){
				contadores[0].Cantidad =contadores[0].Cantidad +1;	
			}else if (strings.ToLower(d.Api)=="go"){
				contadores[1].Cantidad =contadores[1].Cantidad +1;
			}else if (strings.ToLower(d.Api)=="rust"){
				contadores[2].Cantidad =contadores[2].Cantidad +1;
			}

	 
		}
	})

	http.HandleFunc("/finalizarCarga", func(w http.ResponseWriter, r *http.Request) {
		_fecha:= fecha();
		var _python Publicar
		_python.Guardados=contadores[0].Cantidad;
		_python.Api=contadores[0].Api;
		_python.Db="Cosmo";
		_python.TiempoDeCarga=_fecha;

		var _go Publicar
		_go.Guardados=contadores[1].Cantidad;
		_go.Api=contadores[1].Api;
		_go.Db="Cosmo";
		_go.TiempoDeCarga=_fecha;

		var _rust Publicar
		_rust.Guardados=contadores[2].Cantidad;
		_rust.Api=contadores[2].Api;
		_rust.Db="Cosmo";
		_rust.TiempoDeCarga=_fecha;
		//se cargan datos con mysql	
		var _python5 Publicar
		_python5.Guardados=contadores[0].Cantidad;
		_python5.Api=contadores[0].Api;
		_python5.Db="CloudSQL";
		_python5.TiempoDeCarga=_fecha;

		var _go5 Publicar
		_go5.Guardados=contadores[1].Cantidad;
		_go5.Api=contadores[1].Api;
		_go5.Db="CloudSQL";
		_go5.TiempoDeCarga=_fecha;

		var _rust5 Publicar
		_rust5.Guardados=contadores[2].Cantidad;
		_rust5.Api=contadores[2].Api;
		_rust5.Db="CloudSQL";
		_rust5.TiempoDeCarga=_fecha;

		
		_python2, err2 := json.Marshal(_python)
			if err2!= nil {
				fmt.Print(err2)
			} else {
				publish(string(_python2))	
			}
			_go2, err2 := json.Marshal(_go)
			if err2!= nil {
				fmt.Print(err2)
			} else {
				publish(string(_go2))
			}
			_rust2, err2 := json.Marshal(_rust)
			if err2!= nil {
				fmt.Print(err2)
			} else {
				publish(string(_rust2))
			}
			//enviar datos a la base de google
 
			_python3, err2 := json.Marshal(_python5)
			if err2!= nil {
				fmt.Print(err2)
			} else {
				publish(string(_python3))	
			}
			_go3, err2 := json.Marshal(_go5)
			if err2!= nil {
				fmt.Print(err2)
			} else {
				publish(string(_go3))
			}
			_rust3, err2 := json.Marshal(_rust5)
			if err2!= nil {
				fmt.Print(err2)
			} else {
				publish(string(_rust3))
			}

			 arreglo := [6]Publicar{_python,_rust,_go,_python5,_rust5,_go5};

			p, err5 := json.Marshal(arreglo)
			if err5!= nil {
				fmt.Print(err5)
			} else {
				
				pos, err10:=	http.Post("http://localhost:5001/", "application/json", bytes.NewBuffer(p))
				if err10!= nil {
					fmt.Print(err10)
				} else {	fmt.Print(pos)}
					

			}
			


			fmt.Fprintf(w, "finalizarCarga")
	})
	http.ListenAndServe(":4444", nil)
}
 