require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Socket.io server.
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const { PORT } = process.env;

// Import controllers.
const newUser = require('./controllers/newUser');
const loginUser = require('./controllers/loginUser');
const newMessage = require('./controllers/newMessage');
const getMessages = require('./controllers/getMessages');

// Import middlewares.
const isUser = require('./middlewares/isUser');

// General middlewares.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// Add Access Control Allow Origin headers.
app.use(
    cors({
        origin: '*',
    })
);

// Endpoints.
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

// Object's array with all connected users.
let connectedUsers = [];

// When a new user logs in, the first thing to do is to check that
// it is a valid user.
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

        next();
    } else {
        next(new Error('Authentication error'));
    }
}).on('connect', (socket) => {
    // Add a new user to "connectedUsers".
    socket.on('connectUser', (user) => {
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

        io.to(socket.id).emit('username', user.name);

        // If the user is not logged in another window we send the
        // list of users to all users.
        if (!userExists) {
            io.emit('userlist', connectedUsers);
        }

        // Otherwise we will assume that the user is logged into two
        // different windows. We will issue an event that forces the
        // first window to logout.
        else {
            io.to(userExists.socketId).emit('multisession');
        }
    });

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

        // If the message has a receiver we send the message only to the
        // sender and the receiver.
        if (msgInfo.receiver) {
            io.to(receiverSocketId).emit('receive_message', msgInfo);
            io.to(socket.id).emit('receive_message', msgInfo);
        }

        // Otherwise we send the message to everybody.
        else {
            io.emit('receive_message', msgInfo);
        }
    });

    // User disconnect.
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
