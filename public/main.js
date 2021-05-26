import { getMessage, render } from './helpers.js';

const header = document.querySelector('body > header');
const loginForm = document.querySelector('header > form.login-form');
const loginBtn = document.querySelector('button#login-btn');
const registerBtn = document.querySelector('button#register-btn');

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

render();
