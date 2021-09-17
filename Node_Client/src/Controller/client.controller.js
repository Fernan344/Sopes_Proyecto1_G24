const theSocket = require('../Recursos/Socket');
const pool = require('../Mysql/connection');

exports.test = async (req, res) => {
    res.send('Hello World');
}

exports.getTweets = async (req, res) => {       
    await pool.query('SELECT * FROM twit', async function(error, result, fields){
        let results = [];    
        results = result.map(async (data) => {              
            await pool.query('SELECT h.hashtag FROM hashtags h INNER JOIN hash_twit ht ON ht.idHash = h.id WHERE ht.idTwit = ?', 
                                                    [data["id"]], async function(error, result2, fields){
                let results = [];   
                results = result2.map(data => {
                    return data["hashtag"]
                })

                let array = {
                    "id": data["id"],
                    "nombre": data["nombre"],
                    "comentario": data["comentario"],
                    "fecha": data["fecha"],
                    "upvotes": data["upvotes"],
                    "downvotes": data["downvotes"],
                    "hashtags": JSON.stringify(results)
                }

                return array
            }); 
            console.log(resultadoHash)
        })   
        
        if (results.length != 0){ 
            await res.json({                
                "null":false,
                "data": JSON.stringify(results)
            });
        }else{
            await res.json({"null":true});
        }     
    });
    
    /*console.log(req.body)
    let socket = theSocket.getSocket();
    socket.emit('addTweet', req.body);
    res.json({"saludos": "jsjsjs"})*/
}