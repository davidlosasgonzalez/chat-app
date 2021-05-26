/**
 * ############
 * ## isAuth ##
 * ############
 */
const isAuth = async () => {
    const token = await JSON.parse(localStorage.getItem('token'));

    const myHeaders = new Headers({
        'Content-Type': 'application/json',
        Authorization: token,
    });

    const response = await fetch('http://localhost:4000/users/auth', {
        method: 'get',
        headers: myHeaders,
    });

    const { user } = await response.json();

    return user;
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

export { getMessage, isAuth };
