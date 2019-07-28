export default (model, update) => {
    const form = document.createElement("form");

    const username = document.createElement("input");
    username.placeholder = "Username";

    const password = document.createElement("input");
    password.placeholder = "Password";

    form.append(username, password);

    return form;
};