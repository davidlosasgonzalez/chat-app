const messagesDiv = document.querySelector('div.messages');

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

function formatMessages(msgInfo, currentUser) {
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

    const formatTime = new Date(createdAt).toLocaleTimeString('en', {
        hour: '2-digit',
        minute: '2-digit',
    });

    item.innerHTML += `<time datetime="${createdAt}">${formatTime}</time>`;

    return {
        item,
    };
}

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

            const { item, isoDate } = formatMessages(msgInfo, username);

            const { sender } = msgInfo;

            if (sender === username) {
                item.classList.add('from-me');
            } else {
                item.classList.add('from-them');
            }

            const date = new Date(msg.createdAt);

            let day = 0;

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

export { formatMessages, printMessages };
