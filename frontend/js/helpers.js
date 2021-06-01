const messagesDiv = document.querySelector('div.messages');
const msgForm = document.querySelector('form.msg-form');

let day = 0;

/**
 * ##################
 * ## listMessages ##
 * ##################
 */
function listMessages(msgInfo, currentUser) {
    const { sender, senderColor, createdAt } = msgInfo;
    const receiver = msgInfo.receiver ? msgInfo.receiver : null;
    let { text } = msgInfo;

    const item = document.createElement('div');

    text = isThereUrl(text);

    if (!receiver && sender === currentUser) {
        item.innerHTML = `<p>${text}</p>`;
    } else if (!receiver && sender !== currentUser) {
        item.innerHTML = `
            <p><strong style="color: rgb(${senderColor}">${sender}</strong></p> 
            <p>${text}</p>
        `;
    } else if (receiver && sender !== currentUser) {
        item.innerHTML += `
            <p><span>⛔️</span> <strong style="color: rgb(${senderColor}">${sender}</strong></p>
            <p>${text}</p>
        `;
    } else {
        item.innerHTML += `
            <p><span>⛔️</span> <strong>To ${receiver}</strong></p>
            <p>${text}</p>
        `;
    }

    const formatDate = new Date(createdAt).toLocaleTimeString('en', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isoDate = new Date(createdAt).toISOString();

    item.innerHTML += `<time datetime="${isoDate}">${formatDate}</time>`;

    return {
        item,
        isoDate,
    };
}

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
                senderColor: msg.senderColor,
                receiver: msg.receiverName,
                text: msg.text,
                createdAt: msg.createdAt,
            };

            const { item, isoDate } = listMessages(msgInfo, username);

            const { sender } = msgInfo;

            if (sender === username) {
                item.classList.add('from-me');
            } else {
                item.classList.add('from-them');
            }

            const date = new Date(isoDate);

            if (date.getDate() > day) {
                day = date.getDate();

                const dateInfo = document.createElement('div');
                dateInfo.classList.add('date-info');

                const formatDate = date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });

                dateInfo.innerHTML = `${formatDate}`;

                frag.append(dateInfo);
            }

            frag.append(item);
        }

        messagesDiv.append(frag);
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * ##############
 * ## showInfo ##
 * ##############
 */
function showInfo(msg, color) {
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
 * ######################
 * ## addSelectOptions ##
 * ######################
 */
function addSelectOptions(userlist, currentUser) {
    msgForm.elements[0].innerHTML = `<option value="">👥</option>`;

    for (const user of userlist) {
        if (currentUser === user.name) continue;

        const optionExists = document.querySelector(
            `option[value="${user.name}"]`
        );

        if (!optionExists) {
            // Create a new option with the user name.
            const option = document.createElement('option');
            option.setAttribute('value', user.name);
            option.textContent = `⛔ ${user.name}`;

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
    const item = document.createElement('div');

    item.style.cssText = `
            color: grey;
            margin: 2rem 0;
        `;

    item.innerHTML =
        '<p>⚠️ ¡Has sido desconectado porque has iniciado sesión en otra ventana!</p>';

    messagesDiv.append(item);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    msgForm.innerHTML = '';
}

/**
 * ################
 * ## isThereUrl ##
 * ################
 */
function isThereUrl(str) {
    const urlRegex =
        /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    const words = str.split(' ');

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace(urlRegex, (url) => {
            let hyperlink = url;

            if (!hyperlink.match('^https?://')) {
                hyperlink = `https://${hyperlink}`;
            }

            // I need add "&#8205;" to keep the space in white
            // between the previous word and the link.
            return `&#8205;<a href="${hyperlink}">${url}</a>`;
        });
    }

    return words.join(' ');
}

export {
    showInfo,
    listMessages,
    addSelectOptions,
    printMessages,
    disconnectUser,
};
