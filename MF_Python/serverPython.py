#primero instalar https://www.python.org/downloads/
#segundo instalar py -m venv env     
#tercero instalar py -m pip install requests
import json
import requests
def cargarDatos(ruta):
    contadorEnviados=0
    contadorError=0
    with open(ruta)as contenido:
        datos=json.load(contenido)
        for dato in datos:
            try:
                headers={'Content-Type':'application/json'}
                resp = requests.post('http://34.117.248.209/', data = json.dumps(dato),headers=headers)
                if resp.status_code<300:
                    contadorEnviados=contadorEnviados+1
                else:
                    contadorError=contadorError+1
            except:
                contadorError=contadorError+1
    print("cantidad de datos enviados ",contadorEnviados)
    print("cantidad de datos con error ",contadorError)
                
            



 

if __name__=="__main__":
    #esta ruta se cambia dependiendo del archivo de entrada
   ruta="generated.json"
   cargarDatos(ruta)
 