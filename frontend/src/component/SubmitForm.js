import { toDataURL } from "/src/util.js";

import { withHeader } from "/src/component/AppHeader.js";

const handleSubmit = ({ apiUrl, token }, update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.image.type.startsWith("image/")) {
        const dataURL = await toDataURL(data.image);
        data.image = dataURL;
    } else {
        data.image = "";
    }

    console.log(data);

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
};

export default (model, update) => {
    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit(model, update));

    const title = document.createElement("input");
    title.placeholder = "Title";
    title.name = "title";title

    const text = document.createElement("input");
    text.type = "text";
    text.placeholder = "Text";
    text.name = "text";

    const subseddit = document.createElement("input");
    subseddit.placeholder = "Subseddit";
    subseddit.name = "subseddit";

    const image = document.createElement("input");
    image.type = "file";
    image.name = "image";

    const submit = document.createElement("button");
    submit.textContent = "Submit";

    form.append(title, text, subseddit, image, submit);

    return withHeader(model, update, form);
};