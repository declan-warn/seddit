import { createElement, toDataURL, path } from "/src/util.js";

import { withHeader } from "/src/component/AppHeader.js";

export default function () {
    const routeData = (props, otherwise = "") =>
        path(["routeData", ...props])(this.model) || otherwise;

    const handleSubmit = async event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const image = formData.get("image");
        const data = {
            ...Object.fromEntries(formData.entries()),
            id: routeData(["id"]),
            image:
                (image.type && image.type.startsWith("image/"))
                    ? await toDataURL(image)
                    : ""
        };
        
        this.update("POST_SUBMIT", data);
    };

    return withHeader(this.model, this.update, createElement(
        "main", {
            children: [
                ["form", {
                    class: "submit",
                    onSubmit: handleSubmit,
                    children: [
                        ["h1", {
                            children: routeData(["id"]) ? "Edit post" : "Add post"
                        }],
                        ["input", {
                            placeholder: "Title",
                            name: "title",
                            value: routeData(["title"]),
                            required: "",
                        }],
                        ["input", {
                            placeholder: "Text",
                            name: "text",
                            value: routeData(["text"]),
                            required: "",
                        }],
                        ["input", {
                            placeholder: "Subseddit",
                            name: "subseddit",
                            value: routeData(["meta", "subseddit"]) || "all",
                            required: "",
                            ...(routeData(["id"]) ? { disabled: "" } : {})
                        }],
                        ["input", {
                            type: "file",
                            name: "image"
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
