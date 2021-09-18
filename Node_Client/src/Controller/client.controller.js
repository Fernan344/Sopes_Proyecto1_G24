const theSocket = require('../Recursos/Socket');
const pool = require('../Mysql/connection');

exports.test = async (req, res) => {
    res.send('Hello World');
}

exports.getTweets = async (req, res) => {       
    let result = await pool.query('SELECT t.id, t.nombre, t.comentario, t.fecha, t.upvotes, t.downvotes, REPLACE(GROUP_CONCAT(distinct h.hashtag), \',\', \' #\') hashtags FROM hash_twit ht INNER JOIN twit t ON t.id=ht.idTwit INNER JOIN hashtags h ON h.id=ht.idHash GROUP BY t.id ORDER BY t.fecha DESC');
        
    let results = [];
    results = result.map((data) => {      

        let array = {
            "id": data["id"],
            "nombre": data["nombre"],
            "comentario": data["comentario"],
            "fecha": data["fecha"],
            "upvotes": data["upvotes"],
            "downvotes": data["downvotes"],
            "hashtags": "#"+data["hashtags"]
        }
        return array
    })   

    if (results.length != 0){ 
        await res.json({                
            "null":false,
            "data": JSON.stringify(results)
        });
    }else{
        await res.json({"null":true});
    }  
    
    /*console.log(req.body)
    let socket = theSocket.getSocket();
    socket.emit('addTweet', req.body);
    res.json({"saludos": "jsjsjs"})*/
}

exports.reportesMySQL = async (req, res) => {   
    let reporte = {
        "twits": 0,
        "hashtags": 0,
        "upvotes": 0,
        "tophash": [],
        "tophashData": [],
        "days": [],
        "upvotesByDay": [],
        "downvotesByDay": [],
        "last100entrys": []
    }

    let noticias = await pool.query('SELECT COUNT(id) total FROM twit');
     
    reporte.twits = noticias[0]["total"]

    let hashtags = await pool.query('SELECT COUNT(id) total FROM hashtags');

    reporte.hashtags = hashtags[0]["total"]

    let upvotes = await pool.query('SELECT SUM(upvotes) total FROM twit');

    reporte.upvotes = upvotes[0]["total"]

    let top5Hash = await pool.query('SELECT SUM(t.upvotes) total, h.hashtag FROM hash_twit ht INNER JOIN twit t ON t.id=ht.idTwit INNER JOIN hashtags h ON h.id=ht.idHash GROUP BY idHash ORDER BY total DESC LIMIT 5');
        
    let resultsTopH = [];
    let dataTopH = [];

    top5Hash.map((data) => {     
        resultsTopH.push(data["hashtag"])
        dataTopH.push(data["total"])
    })   

    reporte.tophash = (resultsTopH)
    reporte.tophashData = (dataTopH)

    let lastEntries = await pool.query('SELECT t.id, t.nombre, t.comentario, t.fecha, t.upvotes, t.downvotes, REPLACE(GROUP_CONCAT(distinct h.hashtag), \',\', \' #\') hashtags FROM hash_twit ht INNER JOIN twit t ON t.id=ht.idTwit INNER JOIN hashtags h ON h.id=ht.idHash GROUP BY t.id ORDER BY t.fecha DESC LIMIT 100');
        
    let resultsEntries = [];
    resultsEntries = lastEntries.map((data) => { 
        
        let array = [
            data["nombre"],
            data["fecha"],
            data["comentario"],            
            data["upvotes"],
            data["downvotes"],
            "#"+data["hashtags"]
        ]
        return array
    }) 

    reporte.last100entrys = (resultsEntries)

    let votesByDate = await pool.query('SELECT SUM(upvotes) upvotes, SUM(downvotes) downvotes, fecha FROM twit WHERE fecha BETWEEN \'2015-02-23\' AND \'2015-02-28\' GROUP BY fecha');
        
    let labelsVotes = [];
    let numUpvotes = [];
    let numDownVotes = [];

    votesByDate.map((data) => { 
        
        labelsVotes.push(data["fecha"])
        numUpvotes.push(data["upvotes"])
        numDownVotes.push(data["downvotes"]*-1)
    }) 

    reporte.days = labelsVotes
    reporte.upvotesByDay = numUpvotes
    reporte.downvotesByDay = numDownVotes

    res.json({                
        "null":false,
        "data": reporte
    });
    
    /*console.log(req.body)
    let socket = theSocket.getSocket();
    socket.emit('addTweet', req.body);
    res.json({"saludos": "jsjsjs"})*/
}