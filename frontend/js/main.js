import { printMessages } from './lib/messages.js';
import { messageInfo } from './lib/messageInfo.js';
import { addLogoutButton } from './lib/addLogoutButton.js';
import { getQuery } from './lib/credentialsQuery.js';
import { userMessage, connectUser } from './socket.js';

const header = document.querySelector('body > div > header');
const msgForm = document.querySelector('form.msg-form');
const loginForm = document.querySelector('form.login-form');
const registerBtn = document.querySelector('button.register-btn');
const loginBtn = document.querySelector('button.login-btn');
const messagesDiv = document.querySelector('div.messages');
const usersSelect = document.querySelector('select.users');
const audioContainer = document.querySelector('.audioContainer');

// Register button click event.
registerBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = loginForm.elements.name.value;
    const password = loginForm.elements.password.value;

    const bodyParams = {
        name,
        password,
    };

    try {
        await getQuery('http://localhost:4000/users', 'post', bodyParams);

        messageInfo('Registration completed! Please, login to chat!', 'green');
    } catch (error) {
        messageInfo(error.message, '#E65A3C');
    }

    loginForm.elements.name.value = '';
    loginForm.elements.password.value = '';
});

// Login button click event.
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = loginForm.elements.name.value;
    const password = loginForm.elements.password.value;

    const bodyParams = {
        name,
        password,
    };

    try {
        const { data } = await getQuery(
            'http://localhost:4000/users/login',
            'post',
            bodyParams
        );

        localStorage.setItem('token', JSON.stringify(data.token));

        render();
    } catch (error) {
        messageInfo(error.message, '#E65A3C');
    }

    loginForm.elements.name.value = '';
    loginForm.elements.password.value = '';
});

// Logout button click event.
header.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.matches('button.logout-btn')) {
        localStorage.removeItem('token');
        window.location.reload();
    }
});

// Select input change event.
usersSelect.addEventListener('change', (e) => {
    const option = e.target;

    if (option.value) {
        msgInput.setAttribute(
            'placeholder',
            `Direct message to ${option.value}`
        );
    } else {
        msgInput.removeAttribute('placeholder');
    }
});

// Message form submit event.
msgForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (msgInput.value) {
        try {
            const token = JSON.parse(localStorage.getItem('token'));

            const myHeaders = new Headers({
                'Content-Type': 'application/json',
                Authorization: token,
            });

            const bodyParams = {
                text: msgInput.value,
                receiver: usersSelect.value || null,
                createdAt: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' '),
            };

            const data = await getQuery(
                'http://localhost:4000/users/messages',
                'post',
                bodyParams,
                myHeaders
            );

            if (data.status === 'error') {
                throw new Error(data.message);
            }

            audioContainer.play();

            userMessage(msgInfo);

            msgInput.value = '';
        } catch (error) {
            throw new Error(error.message);
        }
    }
});

// Render page.
async function render() {
    try {
        const token = JSON.parse(localStorage.getItem('token')) || '';

        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            Authorization: token,
        });

        const { data } = await getQuery(
            'http://localhost:4000/messages',
            'get',
            null,
            myHeaders
        );

        if (!data) return false;

        const { user, messages } = data;

        addLogoutButton(user);

        messagesDiv.innerHTML = '';

        printMessages(messages, user.name);

        connectUser(user);

        return true;
    } catch (error) {
        console.error('Authentication error');
    }
}

// Llamamos a render.
render();
