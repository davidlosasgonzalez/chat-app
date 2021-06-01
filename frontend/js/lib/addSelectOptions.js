const msgForm = document.querySelector('form.msg-form');

function addSelectOptions(userlist, currentUser) {
    msgForm.elements[0].innerHTML = `<option value="">👥</option>`;

    for (const user of userlist) {
        if (currentUser === user.name) continue;

        const optionExists = document.querySelector(
            `option[value="${user.name}"]`
        );

        if (!optionExists) {
            const option = document.createElement('option');
            option.setAttribute('value', user.name);
            option.textContent = `⛔ ${user.name}`;

            msgForm.elements[0].append(option);
        }
    }
}

export { addSelectOptions };
