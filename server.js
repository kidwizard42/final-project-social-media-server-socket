const app = require('express')();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:4000","https://hidden-forest-41310.herokuapp.com", "https://hidden-forest-41310.herokuapp.com/"],
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3003;
let groupRoom = ''

io.on('connection', socket => {
  
  socket.on('disconnect', () => {
    // console.log('user has disconnected')
  })

  socket.on('message', (message,name) => {
    if(!name){
      io.emit('message', message,`USER-${socket.id}`)
    }else{
      io.emit('message', message, name)
    }
  })


})

http.listen(port, () => {
  console.log(`Socket.IO server running at PORT:${port}/`);
});
