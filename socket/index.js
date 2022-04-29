const PORT = process.env.PORT || 8900

const io = require('socket.io')(PORT, {
    cors:{
        origin: 'https://venturechat.netlify.app',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST"]
    }
});



let users = [];
//track users? rooms?
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

