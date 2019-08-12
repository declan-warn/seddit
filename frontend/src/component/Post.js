import { withHeader } from "/src/component/AppHeader.js";
import FeedItem from "/src/component/FeedItem.js";
import { createElement, toRelativeTime } from "/src/util.js";

const handleSubmit = (model, update) => async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());

    update("COMMENT_SUBMIT", { id: model.routeData.id, body });
};

export default (model, update) => withHeader(model, update, createElement(
    "main", {
        class: "post",
        children: [
            ["ul", {
                children: [
                    FeedItem(model, update, model.routeData)
                ]
            }],
            ["form", {
                onSubmit: handleSubmit(model, update),
                children: [
                    ["h2", {
                        children: "Add comment"
                    }],
                    ["textarea", {
                        placeholder: "Comment...",
                        name: "comment"
                    }],
                    ["button", {
                        children: "Submit"
                    }]
                ]
            }],
            ["h2", {
                children: "Comments"
            }],
            ["ul", {
                class: "comments",
                children: model.routeData.comments.map(
                    ({ author, published, comment }) => createElement(
                        "li", {
                            class: "comment",
                            children: [
                                ["div", {
                                    children: [
                                        ["a", {
                                            children: author
                                        }],
                                        ["time", {
                                            children: toRelativeTime(published * 1000)
                                        }]
                                    ]
                                }],
                                ["span", {
                                    children: comment
                                }]
                            ]
                        }
                    )
                )
            }]
        ]
    }
));
