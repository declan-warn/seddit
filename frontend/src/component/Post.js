import { withHeader } from "/src/component/AppHeader.js";
import { createElement, toRelativeTime } from "/src/util.js";

import FeedItem from "/src/component/FeedItem.js";

export default function Post() {
    const onSubmit = async event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const body = Object.fromEntries(formData.entries());

        this.update("COMMENT_SUBMIT", { id: this.model.routeData.id, body });
    };

    return withHeader(this, createElement(
        "main", {
            class: "post",
            children: [
                ["ul", {
                    children: [
                        FeedItem.call(this, this.model.routeData)
                    ]
                }],
                ["form", {
                    onSubmit,
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
                    children:
                        this.model.routeData.comments
                            .sort((a, b) => Number(b.published) - Number(a.published))
                            .map(({ author, published, comment }) => createElement(
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
                            ))
                }]
            ]
        }
    ));
}
