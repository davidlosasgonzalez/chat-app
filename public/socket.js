import {
    printMessages,
    addSelectOptions,
    removeSelectOption,
    disconnectUser,
} from './helpers.js';

let username;

const token = JSON.parse(localStorage.getItem('token'));

// eslint-disable-next-line no-undef
const socket = io('http://localhost:4000', {
    query: { token },
});

// Show all errors with the socket connection.
socket.on('connect_error', (error) => {
    console.error(error.message);
});

// Send user info to the socket.
function userConnected(user) {
    username = user.name;
    socket.emit('userConnected', user);
}

// Send user message info to socket.
function userMessage(msgInfo) {
    socket.emit('chat message', msgInfo);
}

// Receive user messages.
socket.on('chat message', (msgInfo) => {
    printMessages([msgInfo], username);
});

// If a new user logs in a new <option> is added
// to <select>.
socket.on('userlist', (userlist) => {
    addSelectOptions(userlist);
});

// If a user logs of the <option> with his name
// is deleted.
socket.on('delete user', (username) => {
    removeSelectOption(username);
});

// If a user logs in from a new tab the previous
// session is disconnected
socket.on('multiple connections', () => {
    disconnectUser();
    socket.disconnect();
});

export { userConnected, userMessage };
