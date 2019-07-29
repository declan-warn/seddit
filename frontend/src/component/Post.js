import { withHeader } from "../AppHeader.js";
import FeedItem from "./FeedItem.js";

export default (model, update) => {
    const body = document.createElement("main");

    fetch(`http://${model.apiUrl}/dummy/post?id=${model.postId}`)
        .then(x => x.json())
        .then(x => {
            body.prepend(FeedItem(model, update, x));
            const comments = document.createElement("ul");
            (x.meta.comments || []).map(y => {
                const comment = document.createElement("li");
                comment.textContent = y.comment;

                comments.append(comment);
            });
            body.append(comments);
        });
    
    const commentText = document.createElement("textarea");
    commentText.placeholder = "Add comment...";

    const commentSubmit = document.createElement("button");
    commentSubmit.textContent = "Submit";

    body.append(commentText, commentSubmit);

    return withHeader(model, update, body);
};