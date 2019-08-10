import { createElement } from "/src/util.js";

const handleSubmit = (update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    update("AUTH_LOGIN", data);
};

export default (model, update) => createElement(
    "form", {
        onSubmit: handleSubmit(update),
        children: [
            ["input", {
                placeholder: "Username",
                name: "username",
                required: ""
            }],
            ["input", {
                type: "password",
                placeholder: "Password",
                name: "password",
                required: ""
            }],
            ["button", {
                children: "Submit"
            }]
        ]
    }
);
