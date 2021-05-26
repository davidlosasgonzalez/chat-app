require('dotenv').config();
const { PORT } = process.env;
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Imports
const newUser = require('./controllers/newUser');
const loginUser = require('./controllers/loginUser');
const isUser = require('./controllers/isUser');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.post('/users', newUser);
app.post('/users/login', loginUser);
app.get('/users/auth', isUser);

// Error middleware.
app.use((error, req, res, next) => {
    // console.log(error.message);
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

// Not found middleware.
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

let connectedUsers = [];

// Nueva conexión.
io.on('connect', (socket) => {
    socket.on('currentUser', (currentUser) => {
        const userExists = connectedUsers.find(
            (user) => user.username === currentUser
        );

        connectedUsers.push({
            username: currentUser,
            socketId: socket.id,
        });

        if (!userExists) {
            io.emit('userlist', connectedUsers);
        } else {
            io.to(userExists.socketId).emit('multiple connections');
        }
    });
});

// Enviar mensaje.
io.on('connection', (socket) => {
    socket.on('chat message', (msgInfo) => {
        const sender = connectedUsers.find(
            (user) => user.socketId === socket.id
        );

        let receiverId;

        if (msgInfo.receiver) {
            const receiver = connectedUsers.find(
                (user) => user.username === msgInfo.receiver
            );

            receiverId = receiver.socketId;
        }

        msgInfo.sender = sender.username;

        if (msgInfo.receiver) {
            io.to(receiverId).emit('chat message', msgInfo);
            io.to(socket.id).emit('chat message', msgInfo);
        } else {
            io.emit('chat message', msgInfo);
        }
    });
});

// Desconexión.
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(
            (user) => user.socketId !== socket.id
        );
        io.emit('delete user');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
