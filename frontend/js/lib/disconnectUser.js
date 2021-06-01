const msgForm = document.querySelector('form.msg-form');
const messagesDiv = document.querySelector('div.messages');

function disconnectUser() {
    const item = document.createElement('div');
    item.classList.add('multisession');

    item.style.cssText = `
            color: grey;
            margin: 2rem 0;
        `;

    item.innerHTML =
        '<p>⚠️</p><p>¡Has sido desconectado porque has iniciado sesión en otra ventana!</p>';

    messagesDiv.append(item);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    msgForm.innerHTML = '';
}

export { disconnectUser };
