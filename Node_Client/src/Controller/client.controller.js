const theSocket = require('../Recursos/Socket');

exports.test = async (req, res) => {
    res.send('Hello World');
}

exports.addTweet = async (req, res) => {    
    console.log(req.body)
    let socket = theSocket.getSocket();
    socket.emit('addTweet', req.body);
    res.json({"saludos": "jsjsjs"})
}