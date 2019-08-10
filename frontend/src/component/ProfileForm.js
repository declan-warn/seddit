import * as util from "/src/util.js";
import { withHeader } from "/src/component/AppHeader.js";

const field = (name, label, type = "text") => util.createElement(
    "label", {
        children: [
            ["span", {
                children: label
            }],
            ["input", {
                type,
                name,
                placeholder: name.replace(/./, x => x.toUpperCase())
            }]
        ]
    }
);

export default function ProfileForm() {
    const { model, update } = this;

    const onSubmit = event => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(
            [...formData.entries()].filter(([_, val]) => val !== "")
        );

        update("EDIT_PROFILE", data);
    };

    return withHeader(this.model, this.update, util.createElement(
        "form", {
            onSubmit,
            children: [
                ["span", {
                    children: "Leave a field blank if you do not wish to update it."
                }],
                field("email", "New e-mail", "email"),
                field("name", "New name"),
                field("password", "New password", "password"),
                ["button", {
                    children: "Update profile",
                }]
            ]
        }
    )); 
}
