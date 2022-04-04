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
    if(!name || name.trim() == ""){
      io.emit('message', message,`USER-${socket.id}`)
    }else{
      console.log(name)
      io.emit('message', message, name)
    }
  })


})

http.listen(port, () => {
  console.log(`Socket.IO ARC||leaderboard running at PORT:${port}/`);
});
