const messagesDiv = document.querySelector("div.messages");
const msgForm = document.querySelector("form.msg-form");

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

  const item = document.createElement("div");

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlRegex, '<a href="$1">$1</a>');

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

  const formatDate = new Date(createdAt).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
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
        item.classList.add("from-me");
      } else {
        item.classList.add("from-them");
      }

      const date = new Date(isoDate);

      if (date.getDate() > day) {
        day = date.getDate();

        const dateInfo = document.createElement("div");
        dateInfo.classList.add("date-info");

        const formatDate = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
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
  const existP = document.querySelector("header > form > p");

  if (!existP) {
    const loginForm = document.querySelector("form.login-form");
    const p = document.createElement("p");
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

    const optionExists = document.querySelector(`option[value="${user.name}"]`);

    if (!optionExists) {
      // Create a new option with the user name.
      const option = document.createElement("option");
      option.setAttribute("value", user.name);
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
  const item = document.createElement("li");

  item.style.cssText = `
            color: grey;
        `;

  item.innerHTML =
    "<p>⚠️ ¡Has sido desconectado porque has iniciado sesión en otra ventana!</p>";

  messagesDiv.append(item);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  msgForm.innerHTML = "";
}

export {
  showInfo,
  listMessages,
  addSelectOptions,
  printMessages,
  disconnectUser,
};
