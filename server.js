require('dotenv').config();
const { PORT } = process.env;
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Imports
const newUser = require('./controllers/newUser');
const loginUser = require('./controllers/loginUser');
const newMessage = require('./controllers/newMessage');
const getMessages = require('./controllers/getMessages');
const isUser = require('./middlewares/isUser');
const { log } = require('console');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('dev'));

// Routes
app.post('/users', newUser);
app.post('/users/login', loginUser);
app.post('/messages', isUser, newMessage);
app.get('/messages', isUser, getMessages);

// Error middleware.
app.use((error, req, res, next) => {
    console.log(error.message);
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
            (user) => user.name === currentUser.name
        );

        connectedUsers.push({
            id: currentUser.id,
            name: currentUser.name,
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

        msgInfo.sender = (sender && sender.name) || null;

        let idReceiver;

        if (msgInfo.idReceiver) {
            const receiver = connectedUsers.find(
                (user) => user.id === msgInfo.idReceiver
            );

            idReceiver = receiver.socketId;
            msgInfo.receiver = receiver.name;
        }

        if (msgInfo.receiver) {
            io.to(idReceiver).emit('chat message', msgInfo);
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
