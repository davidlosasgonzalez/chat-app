import { getMessage, isAuth } from './helpers.js';
import connectSocket from './socket.js';

const header = document.querySelector('body > header');
const loginForm = document.querySelector('header > form.login-form');
const loginBtn = document.querySelector('button#login-btn');
const registerBtn = document.querySelector('button#register-btn');
const registerDiv = document.querySelector('div#register');
const msgForm = document.querySelector('form.msg-form');

/**
 * #####################
 * ## Register Button ##
 * #####################
 */
registerBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = loginForm.elements.username.value;
    const password = loginForm.elements.password.value;

    try {
        if (username.length < 4 || password.length < 4) {
            throw new Error(
                'Username and password must be at least 4 characters long!'
            );
        }

        const params = {
            username,
            password,
        };

        await fetch('http://localhost:4000/users', {
            method: 'post',
            body: JSON.stringify(params),
            headers: { 'Content-type': 'application/json' },
        });

        loginForm.elements.username.value = '';
        loginForm.elements.password.value = '';

        getMessage('Registration completed! Please, login to chat!', 'green');
    } catch (error) {
        getMessage(error.message, '#E65A3C');
    }
});

/**
 * ##################
 * ## Login Button ##
 * ##################
 */
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = loginForm.elements.username.value;
    const password = loginForm.elements.password.value;

    try {
        if (!username || !password) {
            throw new Error('Username and password are required!');
        }

        const params = {
            username,
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

        loginForm.elements.username.value = '';
        loginForm.elements.password.value = '';

        isLogged();
    } catch (error) {
        getMessage(error.message, '#E65A3C');
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

const isLogged = async () => {
    const user = await isAuth();

    if (user) connectSocket(user);

    // Check if we receive info about the user.
    if (user) {
        // Hide login form data.
        loginForm.style.visibility = 'hidden';

        // Create a paragraph with username.
        const p = document.createElement('p');
        p.textContent = user.username;
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
};

isLogged();
