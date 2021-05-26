const messages = document.querySelector('ul.messages');
const inputMsg = document.querySelector('input.msg');
const msgForm = document.querySelector('main > form.msg-form');
const select = document.querySelector('select#user');

const connectSocket = async (currentUser) => {
    const socket = io();

    socket.emit('currentUser', currentUser.username);

    /**
     * ##################
     * ## Send Message ##
     * ##################
     */
    msgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputMsg.value) {
            socket.emit('chat message', {
                text: inputMsg.value,
                receiver: select.value,
            });
            inputMsg.value = '';
        }
    });

    /**
     * ####################
     * ## Create Message ##
     * ####################
     */
    socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        item.style.color = 'green';

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        msg.text = msg.text.replace(urlRegex, '<a href="$1">$1</a>');

        if (!msg.receiver && msg.sender === currentUser.username) {
            item.innerHTML = `${msg.text}`;
        } else if (!msg.receiver && msg.sender !== currentUser.username) {
            item.style.color = 'blue';
            item.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
        } else if (msg.receiver && msg.sender !== currentUser.username) {
            item.style.color = 'grey';
            item.innerHTML += `⛔️ <strong>${msg.sender}:</strong> ${msg.text}`;
        } else {
            item.style.color = 'darkgreen';
            item.innerHTML += `⛔️ ${msg.text} (to ${msg.receiver})`;
        }

        messages.append(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    /**
     * ################
     * ## Add Option ##
     * ################
     */
    socket.on('userlist', (userlist) => {
        for (const user of userlist) {
            if (user.username === currentUser.username) continue;

            const optionExists = document.querySelector(
                `option[value="${user.username}"]`
            );

            if (!optionExists) {
                // Create a new option with the user name.
                const option = document.createElement('option');
                option.setAttribute('value', user.username);
                option.textContent = user.username;

                // Append option to select and remove disable attribute.
                msgForm.elements[0].append(option);
            }
        }
    });

    /**
     * ###################
     * ## Delete Option ##
     * ###################
     */
    socket.on('delete user', async () => {
        const option = document.querySelector(
            `option[value="${currentUser.username}"]`
        );
        if (option) option.remove();
    });

    socket.on('multiple connections', async () => {
        window.location.reload();
    });
};

export default connectSocket;
