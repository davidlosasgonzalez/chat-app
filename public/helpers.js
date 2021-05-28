const messagesUl = document.querySelector('ul.messages');
const msgForm = document.querySelector('form.msg-form');

/**
 * ###################
 * ## printMessages ##
 * ###################
 */
function printMessages(messages, username) {
    const frag = document.createDocumentFragment();

    if (messages.length > 0) {
        for (const msg of messages) {
            const msgInfo = {
                sender: msg.senderName,
                receiver: msg.receiverName,
                text: msg.text,
                createdAt: msg.createdAt,
            };

            const item = listMessages(msgInfo, username);

            frag.append(item);
        }

        messagesUl.append(frag);
    }
    messagesUl.scrollTop = messagesUl.scrollHeight;
}

/**
 * ################
 * ## getMessage ##
 * ################
 */
function showError(msg, color) {
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
}

/**
 * ##################
 * ## listMessages ##
 * ##################
 */
function listMessages(msgInfo, currentUser) {
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
}

/**
 * ######################
 * ## addSelectOptions ##
 * ######################
 */
function addSelectOptions(userlist, currentUser) {
    msgForm.elements[0].innerHTML = `<option value="">Destinatario</option>`;

    for (const user of userlist) {
        if (currentUser === user.name) continue;

        const optionExists = document.querySelector(
            `option[value="${user.name}"]`
        );

        if (!optionExists) {
            // Create a new option with the user name.
            const option = document.createElement('option');
            option.setAttribute('value', user.name);
            option.textContent = user.name;

            // Append option to select and remove disable attribute.
            msgForm.elements[0].append(option);
        }
    }
}

/**
 * ####################
 * ## disconnectUser ##
 * ####################
 */
function disconnectUser() {
    const item = document.createElement('li');

    item.style.cssText = `
            color: grey;
        `;

    item.innerHTML =
        '<p>⚠️ ¡Has sido desconectado porque has iniciado sesión en otra ventana!</p>';

    messagesUl.append(item);

    messagesUl.scrollTop = messagesUl.scrollHeight;

    msgForm.innerHTML = '';
}

export {
    showError,
    listMessages,
    addSelectOptions,
    printMessages,
    disconnectUser,
};
