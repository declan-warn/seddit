import { withHeader } from "/src/component/AppHeader.js";
import FeedItem from "/src/component/FeedItem.js";
import { createElement } from "/src/util.js";

const handleSubmit = (model, update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());

    update("COMMENT_SUBMIT", { id: model.routeData.id, body });
};

export default (model, update) => withHeader(model, update, createElement(
    "main", {
        children: [
            FeedItem(model, update, model.routeData),
            ["form", {
                onSubmit: handleSubmit(model, update),
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