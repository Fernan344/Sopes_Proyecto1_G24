import React from "react";
import NavVar from "../Components/NavVar";
import Card from "../Components/CardPublication"
import socket from "../Recursos/Socket";
import {Spinner} from "reactstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

const connection = require("../Recursos/Connection")

class Principal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            twits: [],
            add: false,
            cargado: false              
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
                    cargado: true 
                })
            }
        }) 
        /*socket.on('addTweet', data => {
            this.addTweet(data)
            console.log(JSON.stringify(data), "-----")
        })*/
    }

    render() {
        if(this.state.cargado===false){
            return(
                <form>
                    <NavVar/>
                    <div style={{textAlign: "center", marginTop: 250}}><Spinner color="light"/></div>           
                </form>
            )
        }
        

        return (
            <form>
                <NavVar/>
                <div style={{marginTop: 75}}>
                {
                    
                    this.state.twits.map(tupla => (
                        <Card nombre={tupla["nombre"]} comentario={tupla["comentario"]} fecha={tupla["fecha"]} hashtags={tupla["hashtags"]} downvotes={tupla["upvotes"]} upvotes={tupla["downvotes"]}/>
                    ))
                }    
                </div>         
            </form>
        );
    }
}

export default Principal;