//backend
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatWithD4Y minion";
//run when client connects
io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log(user);
    socket.join(user.room);

    // Welcomes user // emit only submits to the client its on
    socket.emit("message", formatMessage(botName, "Welcome to ChatWithD4Y"));

    //Broadcast when a user connects // broadcast is all clients except connection on
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `The homie ${user.username} has joined the chat`)
      );

    //send users to room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  console.log("New WS connection...");

  //Listen for chat message
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Runs when a client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `bruh, the homie ${user.username} left...`)
      );

      //send users to room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
