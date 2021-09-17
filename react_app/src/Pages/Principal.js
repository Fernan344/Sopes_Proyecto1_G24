import React from "react";
import NavVar from "../Components/NavVar";
import Card from "../Components/CardPublication"
import socket from "../Recursos/Socket";
const connection = require("../Recursos/Connection")

class Principal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            twits: [{"nombre": "Juaquin", "comentario": "Este Es Un Twit De Prueba", "fecha": "24/07/2021", "upvotes": 100, "downvotes":30, "hashtags": ["remo", "atletismo", "natacion"]},
            {"nombre": "Pedro", "comentario": "Fue un maravilloso partido", "fecha": "24/15/2021", "upvotes": 200, "downvotes":30, "hashtags": ["remo", "atletismo", "basketball"]}],
            add: false
            
        }  
        this.addTweet = this.addTweet.bind(this);  
    }

    addTweet(tweet){
        console.log(tweet)
        let array = this.state.twits;
        array.unshift({"nombre": tweet.nombre, "comentario": tweet.comentario, "fecha": tweet.fecha, "upvotes": tweet.upvotes, "downvotes": tweet.downvotes, "hashtags": tweet.hashtags})
        this.setState({
            twits: array,
            add: true
        })
    }

    componentDidMount(){
        fetch(connection.getConnection()+'/getTweets')
        .then(res => res.json()).then((data) => {
            if (data["null"]===false){      
                console.log(data["data"])
                this.setState({
                    twits: JSON.parse(data["data"]),       
                })
            }
        }) 
        /*socket.on('addTweet', data => {
            this.addTweet(data)
            console.log(JSON.stringify(data), "-----")
        })*/
    }

    render() {

        return (
            <form>
                <NavVar/>
                {
                    this.state.twits.map(tupla => (
                        <Card nombre={tupla["nombre"]} comentario={tupla["comentario"]} fecha={tupla["fecha"]} hashtags={tupla["hashtags"]} downvotes={tupla["upvotes"]} upvotes={tupla["downvotes"]}/>
                    ))
                }
                
            </form>
        );
    }
}

export default Principal;