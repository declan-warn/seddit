import { withHeader } from "/src/component/AppHeader.js";
import FeedItem from "./FeedItem.js";
import { createElement } from "../util.js";

const handleSubmit = (model, update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    const response = await fetch(`http://${model.apiUrl}/post/comment?id=${model.postId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Authorization": `Token ${model.token}`,
            "Content-Type": "application/json",
        },
    });

    const json = await response.json();
    console.log(json);
    if (response.status === 200) {
        //update("LOGIN_SUCCESS", json);
    } else {
        alert(json.message);
    }
};

export default (model, update) => withHeader(model, update, createElement(
    "main", {
        children: [
            FeedItem(model, update, model.routeData),
            ["form", {
                onSubmit() { handleSubmit(model, update) },
                children: [
                    ["textarea", {
                        placeholder: "Add comment...",
                        name: "comment"
                    }],
                    ["button", {
                        children: "Submit"
                    }]
                ]
            }],
            ["ul", {
                children: model.routeData.comments.map(
                    ({ comment }) => createElement("li", {
                        children: comment
                    })
                )
            }]
        ]
    }
));