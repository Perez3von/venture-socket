require('dotenv').config();
const io = require('socket.io')(8900, {
    cors:{
        origin: 'https://venture-chat.netlify.app/'
    }
});



let users = [];
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

