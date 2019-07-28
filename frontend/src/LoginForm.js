const handleSubmit = ({ apiUrl }, update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`http://${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log(response);
};

export default (model, update) => {
    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit(model, update));

    const username = document.createElement("input");
    username.placeholder = "Username";
    username.name = "username";

    const password = document.createElement("input");
    password.placeholder = "Password";
    password.name = "password";

    const submit = document.createElement("button");
    submit.textContent = "Submit";

    form.append(username, password, submit);

    return form;
};