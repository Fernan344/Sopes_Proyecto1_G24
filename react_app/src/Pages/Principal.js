import React from "react";
import NavVar from "../Components/NavVar";
import Card from "../Components/CardPublication"

class Principal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            twits: [{"nombre": "Juaquin", "comentario": "Este Es Un Twit De Prueba", "fecha": "24/07/2021", "upvotes": 100, "downvotes":30, "hashtags": ["remo", "atletismo", "natacion"]},
            {"nombre": "Pedro", "comentario": "Fue un maravilloso partido", "fecha": "24/15/2021", "upvotes": 200, "downvotes":30, "hashtags": ["remo", "atletismo", "basketball"]}]
        }    
    }

    render() {

        return (
            <form>
                <NavVar/>
                {
                    this.state.twits.map(tupla => (
                        <Card nombre={tupla["nombre"]} comentario={tupla["comentario"]} fecha={tupla["fecha"]} hashtags={tupla["hashtags"]} upvotes={tupla["upvotes"]} downvotes={tupla["downvotes"]}/>
                    ))
                }
                
            </form>
        );
    }
}

export default Principal;