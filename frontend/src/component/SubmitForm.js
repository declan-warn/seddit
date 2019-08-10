import { createElement, toDataURL, path } from "/src/util.js";

import { withHeader } from "/src/component/AppHeader.js";

const handleSubmit = (model, update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.image.type && data.image.type.startsWith("image/")) {
        const dataURL = await toDataURL(data.image);
        data.image = dataURL;
    } else {
        data.image = "";
    }

    data.id = path(["routeData", "id"])(model);

    console.log(data);

    update("POST_SUBMIT", data);

    /*
    const response = await fetch(`http://${apiUrl}/post`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        },
    });

    const json = await response.json();
    console.log(response, json);
    if (response.status === 200) {
        update("SUBMIT_SUCCESS");
    } else {
        alert(json.message);
    }
    */
};

export default (model, update) => {
    const routeData = props =>
        path(["routeData", ...props])(model) || "";

    console.log(model.routeData);
    console.log(routeData("title"))
    console.log(path(["routeData", "title"])(model))

    const form = createElement("form", {
        onSubmit: handleSubmit(model, update),
        children: [
            ["input", {
                placeholder: "Title",
                name: "title",
                value: routeData(["title"])
            }],
            ["input", {
                placeholder: "Text",
                name: "text",
                value: routeData(["text"])
            }],
            ["input", {
                placeholder: "Subseddit",
                name: "subseddit",
                value: routeData(["meta", "subseddit"])
            }],
            ["input", {
                type: "file",
                name: "image"
            }],
            ["button", {
                children: "Submit"
            }]
        ]
    });

    const div = createElement("div", {
        children: [
            form
        ]
    });

    return withHeader(model, update, div);
};
