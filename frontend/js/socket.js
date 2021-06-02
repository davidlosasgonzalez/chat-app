/**
 * Maybe it would have been better to integrate this code in main.js,
 * but this is the first time I work with socket.io so I like to have
 * this part in a separate file.
 *
 */

import { addSelectOptions } from './lib/addSelectOptions.js';
import { printMessages } from './lib/messages.js';
import { disconnectUser } from './lib/disconnectUser.js';

// We will keep the current user data in this variable.
let currentUser;

const token = JSON.parse(localStorage.getItem('token'));

// Socket init. Before connecting, we check whether
// the user is authorised.
const socket = io('http://localhost:4000', {
    query: { token },
    transports: ['websocket'],
    upgrade: false,
});

// Send current user info to server.
function connectUser(currentUser) {
    socket.emit('connectUser', currentUser);
}

// Send user message info to socket.
function userMessage(msgInfo) {
    socket.emit('send_message', msgInfo);
}

// It receives the user's name and stores it in currentUser.
socket.on('username', (username) => {
    currentUser = username;
});

// Receive user messages.
socket.on('receive_message', (msgInfo) => {
    printMessages([msgInfo], currentUser);
});

// If a new user logs in a new <option> is added
// to <select>.
socket.on('userlist', (userlist) => {
    console.log(userlist, currentUser);
    addSelectOptions(userlist, currentUser);
});

// If a user logs in from a new tab the previous
// session is disconnected
socket.on('multisession', () => {
    disconnectUser();
    socket.disconnect();
});

// Show all errors with the socket connection.
socket.on('connect_error', (error) => {
    console.error(error.message);
});

export { userMessage, connectUser };
