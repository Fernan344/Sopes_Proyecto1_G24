const express = require('express')
const Server = require('socket.io')
const WebSocketServer = require('socket.io')
const http = require('http')
const theSocket = require('./Recursos/Socket');
const clientRouter = require('./routes/client.router.js')

const morgan = require('morgan');
const cors = require('cors')
const urls = require('url')

const app = express()

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());
app.use(morgan('dev'));
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', clientRouter)

const httpServer = http.createServer(app);

const io = WebSocketServer(httpServer)

io.on('connection', (socket) => {
    console.log('nueva Conexion', socket.id)
})

httpServer.listen(app.get('port'), ()=>{
    console.log('server chambeando papi 4000'); 
    theSocket.setSocket(io);
});