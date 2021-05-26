import connectSocket from './socket.js';

const loginForm = document.querySelector('header > form.login-form');
const registerDiv = document.querySelector('div#register');
const messagesUl = document.querySelector('ul.messages');
const msgForm = document.querySelector('form.msg-form');

/**
 * ############
 * ## Render ##
 * ############
 */
const render = async () => {
    const token = await JSON.parse(localStorage.getItem('token'));

    const myHeaders = new Headers({
        'Content-Type': 'application/json',
        Authorization: token,
    });

    const response = await fetch('http://localhost:4000/messages', {
        method: 'get',
        headers: myHeaders,
    });

    const { data } = await response.json();
    const user = data ? data.user : null;
    const messages = data ? data.messages : null;

    if (user) connectSocket(user);

    // Check if we receive info about the user.
    if (user) {
        registerDiv.innerHTML = '';

        // Hide login form data.
        loginForm.style.visibility = 'hidden';

        // Create a paragraph with user name.
        const p = document.createElement('p');
        p.textContent = user.name;
        p.style.cssText = `
            margin-right: 10px;
            color: #fff;
            font-weight: bold;
        `;

        // Create a button to logout.
        const logoutBtn = document.createElement('button');
        logoutBtn.setAttribute('id', 'logout-btn');
        logoutBtn.textContent = 'Logout';

        // Append button to header.
        registerDiv.append(p, logoutBtn);

        msgForm.elements[0].removeAttribute('disabled');
        msgForm.elements[1].removeAttribute('disabled');
        msgForm.elements[2].removeAttribute('disabled');

        const frag = document.createDocumentFragment();

        messagesUl.innerHTML = '';

        if (messages.length > 0) {
            for (const msg of messages) {
                const msgInfo = {
                    sender: msg.senderName,
                    receiver: msg.receiverName,
                    text: msg.text,
                    createdAt: msg.createdAt,
                };

                const item = listMessages(msgInfo, user.name);

                frag.append(item);
            }

            messagesUl.append(frag);
        }
        messagesUl.scrollTop = messagesUl.scrollHeight;
    }
};

/**
 * ################
 * ## getMessage ##
 * ################
 */
const getMessage = (msg, color) => {
    const existP = document.querySelector('header > form > p');

    if (!existP) {
        const loginForm = document.querySelector('form.login-form');
        const p = document.createElement('p');
        p.textContent = `${msg}`;
        p.style.cssText = `
            display: inline;    
            color: ${color};
            margin-left: 5px;
            font-size: 14px
        `;

        loginForm.append(p);

        setTimeout(() => p.remove(), 3000);
    }
};

/**
 * ##################
 * ## listMessages ##
 * ##################
 */
const listMessages = (msgInfo, currentUser) => {
    const { sender, createdAt } = msgInfo;
    const receiver = msgInfo.receiver ? msgInfo.receiver : null;
    let { text } = msgInfo;

    const item = document.createElement('li');

    item.style.cssText = `
        color: green;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, '<a href="$1">$1</a>');

    if (!receiver && sender === currentUser) {
        item.innerHTML = `<p>🟢 ${text}</p>`;
    } else if (!receiver && sender !== currentUser) {
        item.style.color = 'blue';
        item.innerHTML = `<p><strong>${sender}:</strong> ${text}</p>`;
    } else if (receiver && sender !== currentUser) {
        item.style.color = 'grey';
        item.innerHTML += `<p>⛔️ <strong>${sender}:</strong> ${text}</p>`;
    } else {
        item.style.color = 'darkgreen';
        item.innerHTML += `<p>⛔️ ${text} (to ${receiver})</p>`;
    }

    const formatDate = new Date(createdAt).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });

    item.innerHTML += `<time>${formatDate}</time>`;

    return item;
};

export { getMessage, listMessages, render };
