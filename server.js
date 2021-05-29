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
const jwt = require('jsonwebtoken');

// Imports
const newUser = require('./controllers/newUser');
const loginUser = require('./controllers/loginUser');
const newMessage = require('./controllers/newMessage');
const getMessages = require('./controllers/getMessages');
const isUser = require('./middlewares/isUser');

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

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        let user;

        jwt.verify(
            socket.handshake.query.token,
            process.env.SECRET,
            (error, decoded) => {
                if (error) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                user = decoded;
            }
        );

        // Add new user to "connectedUsers".
        const { id, name, color } = user;

        const userExists = connectedUsers.find((user) => {
            return user.name === name && user.id === id;
        });

        connectedUsers.push({
            id,
            name,
            color,
            socketId: socket.id,
        });

        io.on('connect', () => {
            io.to(socket.id).emit('username', user.name);

            if (!userExists) {
                io.emit('userlist', connectedUsers);
            } else {
                io.to(userExists.socketId).emit('multisession');
            }
        });

        next();
    } else {
        next(new Error('Authentication error'));
    }
}).on('connect', (socket) => {
    // User send a new message.
    socket.on('send_message', (msgInfo) => {
        const sender = connectedUsers.find(
            (user) => user.socketId === socket.id
        );

        msgInfo.senderName = sender.name;
        msgInfo.senderColor = sender.color;

        let receiverSocketId;

        if (msgInfo.receiver) {
            const receiver = connectedUsers.find(
                (user) => user.name === msgInfo.receiver
            );
            receiverSocketId = receiver.socketId;
            msgInfo.receiverName = receiver.name;
        }

        if (msgInfo.receiver) {
            io.to(receiverSocketId).emit('receive_message', msgInfo);
            io.to(socket.id).emit('receive_message', msgInfo);
        } else {
            io.emit('receive_message', msgInfo);
        }
    });

    // User disconnect
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(
            (user) => user.socketId !== socket.id
        );

        io.emit('userlist', connectedUsers);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
