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
            id: routeData("id"),
            image:
                (image.type && image.type.startsWith("image/"))
                    ? await toDataURL(image)
                    : ""
        };
        
        this.update("POST_SUBMIT", data);
    };

    return withHeader(this.model, this.update, createElement(
        "form", {
            onSubmit: handleSubmit,
            children: [
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
                    value: routeData(["meta", "subseddit"]),
                    required: "",
                }],
                ["input", {
                    type: "file",
                    name: "image"
                }],
                ["button", {
                    children: "Submit"
                }]
            ]
        }
    ));
}
