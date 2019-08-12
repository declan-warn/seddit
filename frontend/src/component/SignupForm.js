import { createElement } from "/src/util.js";
import { withHeader } from "/src/component/AppHeader.js";

export default function() {
    const handleSubmit = async event => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
    
        this.update("AUTH_SIGNUP", data);
    };

    return withHeader(this, createElement(
        "main", {
            children: [
                ["form", {
                    onSubmit: handleSubmit,
                    children: [
                        ["h1", {
                            children: "Signup"
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
                }]
            ]
        }
    ));
}
