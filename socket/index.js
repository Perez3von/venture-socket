require('dotenv').config();
const { createServer }= require('http');
const PORT = process.env.PORT || 8900;
const { Server } = require('socket.io');
const httpServer = createServer();
// const io = require('socket.io')(8900, {
//     cors:{
//         origin: 'https://venturechat.netlify.app',
//         credentials: true,
//         optionsSuccessStatus: 200,
//         methods: ['GET, POST']
//     }
// });
const io = new Server( httpServer, {
    cors:{
        origin: 'https://venturechat.netlify.app',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET, POST']
    }
});

//track users? rooms?npm 
// <-- this is the problem
io.on('connection', (socket) => {
    let currRoom

    console.log('connected', socket.id);
    console.log('yo');
    socket.on('create', ({room})=>{
        currRoom = room;
        socket.join(room);
        console.log(room);
    });

    socket.on('sendMessage', ({ msg }) =>{

        io.to(currRoom).emit('getMessage', {
            myMessage:msg
        })
        console.log(msg);

    })

    socket.on('disconnect', ()=>{
        console.log('disconnected', socket.id)
    })
});

httpServer.listen(PORT)