import { createElement } from "/src/util.js";
import { withHeader } from "/src/component/AppHeader.js";

export default function() {
    const handleSubmit = async event => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
    
        try {
            this.update("AUTH_LOGIN", data);
        } catch (message) {
            alert("UM WHAT");
        }
    };

    return withHeader(this.model, this.update, createElement(
        "main", {
            children: [
                ["form", {
                    class: "login",
                    onSubmit: handleSubmit,
                    children: [
                        ["h1", {
                            children: "Login"
                        }],
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
                }]
            ]
        }
    ));
}
