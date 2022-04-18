const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:4000", "https://murmuring-bayou-78293.herokuapp.com/", "https://murmuring-bayou-78293.herokuapp.com"],
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3003;

let groupRoom = ''
let users = 0
io.on('connection', socket => {
  users++
  io.emit('userNum', users)
  socket.on('disconnect', () => {
    users--
    io.emit('userNum', users)
  })


  socket.on('message', (message,name) => {
    // console.log(message)
    if(!name || name.trim() == ""){
      io.emit('message', message,`USER-${socket.id}`)
    }else{
      // console.log(name)
      io.emit('message', message, name)
    }
  })

  socket.on("joinRoom", (roomCode) => {
    // to make sure only two people can go to a room
    const roomCodeRoom = io.sockets.adapter.rooms.get(roomCode)
    if (!roomCodeRoom ){
      socket.join(roomCode);
    console.log(`A user ${socket.id}joined the room ${roomCode}`);
    }else if (roomCodeRoom.size< 2){
      socket.join(roomCode);
      // trying to have the game start here for both
      // both a broadcast and emit so both users get the game state 
      if(Math.ceil(Math.random()*2) == 1) {
        socket.broadcast.to(roomCode).emit("isReady", {room:roomCode, player:'O'}, false);
        socket.emit(`isReady`, {room:roomCode, player:'X'}, true)
      }else{
        socket.broadcast.to(roomCode).emit("isReady", {room:roomCode, player:'X'}, true);
        socket.emit(`isReady`, {room:roomCode, player:'O'}, false)
      }
      console.log(`A user ${socket.id}joined the room ${roomCode}`);
    }else {
      console.log('room is full')
      socket.emit('res', 'room is full')
    } 
  });

// sends the game state to the correct room
  socket.on("play", ( roomCode, game ) => {

    socket.broadcast.to(roomCode).emit("gameState", game);

    // socket.emit("gameState", {room:roomCode})
  });

  socket.on("gameOver", (roomCode, winnerBoolean, game) => {
    if(winnerBoolean){
      socket.broadcast.to(roomCode).emit("loser", game);
    }else if (!winnerBoolean){
      socket.broadcast.to(roomCode).emit("winner", game);

    }
  })
})

http.listen(port, () => {
  console.log(`Socket.IO ARC||leaderboard running at PORT:${port}/`);
});

// const app = require('express')();
// const http = require('http').Server(app);
// const io = require("socket.io")(http, {
//   cors: {
//     origin: ["http://localhost:3000","http://localhost:3001","http://localhost:4000", "https://murmuring-bayou-78293.herokuapp.com/", "https://murmuring-bayou-78293.herokuapp.com"],
//     methods: ["GET", "POST"]
//   }
// });

// const secondPort = process.env.SECONDPORT || 3003;

// const gameState = [
//   {value:"",num:0, isClicked:false},
//   {value:"",num:1, isClicked:false},
//   {value:"",num:2, isClicked:false},
//   {value:"",num:3, isClicked:false},
//   {value:"",num:4, isClicked:false},
//   {value:"",num:5, isClicked:false},
//   {value:"",num:6, isClicked:false},
//   {value:"",num:7, isClicked:false},
//   {value:"",num:8, isClicked:false},
// ]

// http.listen(secondPort, () => {
//   console.log(`Socket.IO ARC||leaderboard running at PORT:${secondPort}/`);
// }); 

// io.on('connection', socket => {

//   // intitial state sent on connection
//   io.emit('ticTac', gameState)

//   socket.on('ticTac',(gameData) => {
//     console.log(gameData)
//     io.emit( 'ticTac', gameData,'instant')
//   })

// })


