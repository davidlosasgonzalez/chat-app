import { printMessages, addSelectOptions, disconnectUser } from './helpers.js';

let currentUser;

const token = JSON.parse(localStorage.getItem('token'));

// Socket init. Before connecting, we check whether
// the user is authorised.
const socket = io('http://localhost:4000', {
    query: { token },
    transports: ['websocket'],
    upgrade: false,
});

// Show all errors with the socket connection.
socket.on('connect_error', (error) => {
    console.error(error.message);
});

// It receives the user's name and stores it in currentUser.
socket.on('username', (username) => {
    currentUser = username;
});

// Send user message info to socket.
function userMessage(msgInfo) {
    socket.emit('send_message', msgInfo);
}

// Receive user messages.
socket.on('receive_message', (msgInfo) => {
    printMessages([msgInfo], currentUser);
});

// If a new user logs in a new <option> is added
// to <select>.
socket.on('userlist', (userlist) => {
    addSelectOptions(userlist, currentUser);
});

// If a user logs in from a new tab the previous
// session is disconnected
socket.on('multisession', () => {
    disconnectUser();
    socket.disconnect();
});

export { userMessage };
