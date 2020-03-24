//backend
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
io.on('connection', socket => {
    console.log('New WS connection...');

    // Welcomes user // emit only submits to the client its on 
    socket.emit('message', 'Welcome to ChatWithD4Y');

    //Broadcast when a user connects // broadcast is all clients except connection on
    socket.broadcast.emit('message', 'A user has joined the chat');

    //Runs when a client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    //Listen for chat message
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    })

})
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
