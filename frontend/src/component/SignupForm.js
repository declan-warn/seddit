import { createElement } from "/src/util.js";

const handleSubmit = (update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    update("AUTH_SIGNUP", data);
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
            ["input", {
                type: "email",
                placeholder: "Email",
                name: "email",
                required: ""
            }],
            ["input", {
                placeholder: "Name",
                name: "name",
                required: ""
            }],
            ["button", {
                children: "Submit"
            }]
        ]
    }
);
