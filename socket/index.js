const PORT = process.env.PORT || 8900

const io = require('socket.io')(PORT, {
    cors:{
        origin: true,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST"]
    }
});

// const io = require('socket.io')(8900, {
//     cors:{
//         origin: 'http://localhost:3000'
//     }
// });

io.origins("https://venturechat.netlify.app");

let community = new Map();

function addUser(room, person, sId){
    if(community.has(room)){
        community.get(room).add(person)
    }
    else{
        community.set(room, new Set([person]))
        
    }
    
    if(community.has(person)){
        community.get(person).add(sId);
    }else{
        community.set(person, new Set([sId]))
    }
    community.set(sId, [room, person]);
  
}

function removeUser(sId){
   const room = community.get(sId);
  
   if(room !== undefined){
       community.get(room[0]).delete(room[1]) 
       community.delete(sId)
   }
}

function getUser(sId){
    const room = community.get(sId);
  
    if(room !== undefined){
        return room[1]
    }
 }

function getUsers(sId){
    const room = community.get(sId);
  
    if(room !== undefined){
        return community.get(room[0]); 
    }
}
//track users? rooms?
// <-- this is the problem
io.on('connection', (socket) => {
    let currRoom


    socket.on('create', ({room, people})=>{
        currRoom = room;
        addUser(room, people, socket.id )
        socket.join(room);
        
    });
    socket.on('userOnline', ({info})=>{
        users = Array.from(getUsers(socket.id))
        io.to(currRoom).emit('usersOnlineData', {
            usersOnline:users,
            list: info
        })
        console.log('MELO', users, community, info);

    } )

    socket.on('sendMessage', ({ msg }) =>{

        io.to(currRoom).emit('getMessage', {
            myMessage:msg
        })
        console.log(msg);

    })

    socket.on('disconnect', ()=>{
        
        if(community.get(socket.id)){

            const thisUser = community.get(socket.id)[1];
            const room = community.get(socket.id)[0];
            removeUser(socket.id); 
            community.get(thisUser).forEach(sId=> community.delete(sId));
            community.delete(thisUser);
            
             io.to(currRoom).emit('usersOnline', {
            usersOnline:Array.from(community.get(room))
        });
        }
        
        console.log('disconnected', socket.id)
    })
});

