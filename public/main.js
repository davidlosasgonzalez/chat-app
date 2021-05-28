import { showError, printMessages } from './helpers.js';
import { userMessage } from './socket.js';

const header = document.querySelector('body > header');
const loginForm = document.querySelector('header > form.login-form');
const registerDiv = document.querySelector('div#register');
const loginBtn = document.querySelector('button#login-btn');
const registerBtn = document.querySelector('button#register-btn');
const inputMsg = document.querySelector('input.msg');
const msgForm = document.querySelector('main > form.msg-form');
const select = document.querySelector('select#user');
const messagesUl = document.querySelector('ul.messages');

/**
 * #####################
 * ## Register Button ##
 * #####################
 */
registerBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = loginForm.elements.name.value;
    const password = loginForm.elements.password.value;

    try {
        if (name.length < 4 || password.length < 4) {
            throw new Error(
                'Username and password must be at least 4 characters long!'
            );
        }

        const params = {
            name,
            password,
        };

        await fetch('http://localhost:4000/users', {
            method: 'post',
            body: JSON.stringify(params),
            headers: { 'Content-type': 'application/json' },
        });

        loginForm.elements.name.value = '';
        loginForm.elements.password.value = '';

        showError('Registration completed! Please, login to chat!', 'green');
    } catch (error) {
        showError(error.message, '#E65A3C');
    }
});

/**
 * ##################
 * ## Login Button ##
 * ##################
 */
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = loginForm.elements.name.value;
    const password = loginForm.elements.password.value;

    try {
        if (!name || !password) {
            throw new Error('Username and password are required!');
        }

        const params = {
            name,
            password,
        };

        const response = await fetch('http://localhost:4000/users/login', {
            method: 'post',
            body: JSON.stringify(params),
            headers: { 'Content-type': 'application/json' },
        });

        const { data } = await response.json();

        if (!data) {
            throw new Error('Wrong username or password!');
        }

        localStorage.setItem('token', JSON.stringify(data.token));

        loginForm.elements.name.value = '';
        loginForm.elements.password.value = '';

        render();
    } catch (error) {
        showError(error.message, '#E65A3C');
    }
});

/**
 * ###################
 * ## Logout Button ##
 * ###################
 */
header.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.matches('button#logout-btn')) {
        localStorage.removeItem('token');
        window.location.reload();
    }
});

/**
 * #####################
 * ## addLogoutButton ##
 * #####################
 */
function addLogoutButton(user) {
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
}

/**
 * ##################
 * ## Send Message ##
 * ##################
 */
msgForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (inputMsg.value) {
        try {
            const token = await JSON.parse(localStorage.getItem('token'));

            const myHeaders = new Headers({
                'Content-Type': 'application/json',
                Authorization: token,
            });

            const msgInfo = {
                text: inputMsg.value,
                receiver: select.value || null,
                createdAt: new Date(),
            };

            await fetch('http://localhost:4000/messages', {
                method: 'post',
                body: JSON.stringify(msgInfo),
                headers: myHeaders,
            });

            userMessage(msgInfo);

            inputMsg.value = '';
        } catch (error) {
            throw new Error('Error saving the message in the database');
        }
    }
});

/**
 * ############
 * ## Render ##
 * ############
 */
async function render() {
    try {
        const token = JSON.parse(localStorage.getItem('token')) || '';

        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            Authorization: token,
        });

        const response = await fetch('http://localhost:4000/messages', {
            method: 'get',
            headers: myHeaders,
        });

        const { data } = await response.json();

        // Si no existe data daremos por hecho que el usuario no tiene
        // un token válido.
        if (!data) return false;

        const { user, messages } = data;

        addLogoutButton(user);

        messagesUl.innerHTML = '';

        printMessages(messages, user.name);

        return true;
    } catch (error) {
        console.error('Authentication error');
    }
}

// Llamamos a render.
render();
