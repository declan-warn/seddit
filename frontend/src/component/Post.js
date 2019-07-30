import { withHeader } from "../AppHeader.js";
import FeedItem from "./FeedItem.js";

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

export default (model, update) => {
    const body = document.createElement("main");

    fetch(`http://${model.apiUrl}/dummy/post?id=${model.postId}`)
        .then(x => x.json())
        .then(x => {
            console.log(x);
            body.prepend(FeedItem(model, update, x));
            const comments = document.createElement("ul");
            x.comments.map(y => {
                const comment = document.createElement("li");
                comment.textContent = y.comment;

                comments.append(comment);
            });
            body.append(comments);
        });

    const commentText = document.createElement("textarea");
    commentText.placeholder = "Add comment...";
    commentText.name = "comment";

    const commentSubmit = document.createElement("button");
    commentSubmit.textContent = "Submit";

    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit(model, update));
    form.append(commentText, commentSubmit);

    body.append(form);

    return withHeader(model, update, body);
};