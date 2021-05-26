import { render } from './helpers.js';

const inputMsg = document.querySelector('input.msg');
const msgForm = document.querySelector('main > form.msg-form');
const select = document.querySelector('select#user');
const messagesUl = document.querySelector('ul.messages');

const connectSocket = async (currentUser) => {
    const socket = io();

    socket.emit('currentUser', currentUser);

    /**
     * ##################
     * ## Send Message ##
     * ##################
     */
    // ! Problemon - Con addEventListener se acumulan los eventos por lo que cada vez que se ejecuta
    // ! connectSocket se envia un mensaje repetido a mayores.
    msgForm.onsubmit = async (e) => {
        e.preventDefault();
        if (inputMsg.value) {
            try {
                const token = await JSON.parse(localStorage.getItem('token'));

                const myHeaders = new Headers({
                    'Content-Type': 'application/json',
                    Authorization: token,
                });

                const msgInfo = {
                    message: inputMsg.value,
                    idSender: currentUser.id,
                    idReceiver: select.value || null,
                    createdAt: new Date(),
                };

                await fetch('http://localhost:4000/messages', {
                    method: 'post',
                    body: JSON.stringify(msgInfo),
                    headers: myHeaders,
                });

                socket.emit('chat message', msgInfo);

                inputMsg.value = '';
            } catch (error) {
                throw new Error('Error saving the message in the database');
            }
        }
    };

    /**
     * ####################
     * ## Create Message ##
     * ####################
     */
    socket.on('chat message', () => {
        socket.disconnect();
        render();
    });

    /**
     * ################
     * ## Add Option ##
     * ################
     */
    socket.on('userlist', (userlist) => {
        for (const user of userlist) {
            if (user.name === user.name) continue;

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
    });

    /**
     * ###################
     * ## Delete Option ##
     * ###################
     */
    socket.on('delete user', async () => {
        console.warn('El usuario se desconecto');
        const option = document.querySelector(
            `option[value="${currentUser.name}"]`
        );
        if (option) option.remove();
    });

    socket.on('multiple connections', () => {
        const item = document.createElement('li');

        item.style.cssText = `
            color: grey;
        `;

        item.innerHTML =
            '<p>⚠️ ¡Has sido desconectado porque has iniciado sesión en otra ventana!</p>';

        messagesUl.append(item);

        messagesUl.scrollTop = messagesUl.scrollHeight;

        msgForm.innerHTML = '';

        socket.disconnect();
    });
};

export default connectSocket;
