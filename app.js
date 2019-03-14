const express = require('express');
const app = express();

// define http & server
const http = require('http');
const server = http.Server(app);

// framework to mongoDB
const mongoose = require('mongoose');

// Vars for routing in server
const usersRouter = require('./routes/users');
const onlineUsers = require('./routes/onlineUsers');

// use routers
app.use('/users', usersRouter);
app.use('/onlineUsers',onlineUsers);

// define socketio to server
const socketio = require('socket.io');
const io = socketio(server);

// port define
const PORT = process.env.PORT || 5000;

// connecting to mongodb
mongoose.connect("mongodb+srv://Tom:yewMZEZVsb7tsAan@cluster0-atxex.mongodb.net/ChatUsers?retryWrites=true")
    .then(() => {
        console.log('connect to mongoDb!')
    })
    .catch((error) => {
        console.log(error);
    });


app.get("/", (req, res) => {
    res.send({ hello: "world" });
 });

 // method that check if user connect
io.on('connection',(socket) =>{


    socket.on('disconnect', function(data){

    });



    // new user join
    socket.on('join',function(data){
        socket.join(data.room)
        console.log(data.user + " joined to:" + data.room + data.date);
        socket.broadcast.to(data.room)
        .emit('new user joined',{user:data.user,message:'joined this room',date:data.date});

    });

    // user leave
    socket.on('leave',function(data){

        socket.leave(data.room)
        console.log(data.user + " leave :" + data.room);
        socket.broadcast.to(data.room)
        .emit('new user leave',{user:data.user,message:'leave this room',date:data.date});
    });

    // handle in incoming message from client!
socket.on('new-message', (data) => {
    console.log(data);
    io.in(data.room).emit('new-message',{user:data.user,message:data.message,date:data.date});
  });


socket.on('typing',(data) => {
    console.log(data.user);
 socket.broadcast.to(data.room).emit('typing',{user:data.user});
});

socket.on('stop-typing',(data) => {
    console.log(data.user);
 socket.broadcast.to(data.room).emit('stop-typing',{user:data.user});
});

});


 app.listen(PORT);