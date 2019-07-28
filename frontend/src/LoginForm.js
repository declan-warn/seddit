const handleSubmit = update => event => {
    event.preventDefault();
};

export default (model, update) => {
    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit(update));

    const username = document.createElement("input");
    username.placeholder = "Username";

    const password = document.createElement("input");
    password.placeholder = "Password";

    const submit = document.createElement("button");
    submit.textContent = "Submit";

    form.append(username, password, submit);

    return form;
};