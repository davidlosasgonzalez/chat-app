const msgForm = document.querySelector('form.msg-form');
const registerDiv = document.querySelector('div.register');
const loginForm = document.querySelector('form.login-form');
const messagesDiv = document.querySelector('div.messages');

function addLogoutButton(user) {
    registerDiv.innerHTML = '';

    loginForm.style.display = 'none';
    messagesDiv.style.display = 'flex';

    const p = document.createElement('p');
    p.textContent = `🟢 ${user.name}`;

    const logoutBtn = document.createElement('button');
    logoutBtn.setAttribute('class', 'logout-btn');
    logoutBtn.textContent = '🔒';

    registerDiv.append(p, logoutBtn);

    msgForm.elements[0].removeAttribute('disabled');
    msgForm.elements[1].removeAttribute('disabled');
    msgForm.elements[2].removeAttribute('disabled');
}

export { addLogoutButton };
