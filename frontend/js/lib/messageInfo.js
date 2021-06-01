const loginForm = document.querySelector('form.login-form');

function messageInfo(msg, color) {
    const existP = document.querySelector(
        'main.chatroom > form.login-form > p.msg-info'
    );

    if (existP) existP.remove();

    const p = document.createElement('p');
    p.classList.add('msg-info');

    p.textContent = `${msg}`;
    p.style.color = color;

    loginForm.append(p);

    setTimeout(() => p.remove(), 3000);
}

export { messageInfo };
