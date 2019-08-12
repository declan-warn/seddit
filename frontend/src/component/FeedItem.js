import { createElement, toRelativeTime, path, showModal } from "/src/util.js";
import * as route from "/src/route.js";

export default function FeedItem({ id, image, meta, title, text, thumbnail, comments }) {
    const showUpvotes = async ({ upvotes }) => {
        if (!upvotes) return;
    
        const users = await Promise.all(upvotes.map(userId =>
            fetch(`http://${this.model.apiUrl}/dummy/user?id=${userId}`)
                .then(x => x.json())
        ));
    
        showModal(createElement(
            "ul", {
                children: users.map(({ username }) => createElement(
                    "li", {
                        children: username
                    }
                ))
            }
        ));
    };

    const handleVote = ({ currentTarget }) => {
        const undo = currentTarget.classList.contains("active");
        this.update("VOTE_ATTEMPT", {
            id,
            toggleIndicator() {
                const score = currentTarget.nextElementSibling;
                const isActive = currentTarget.classList.contains("active");
                score.textContent = Number(score.textContent) + (isActive ? (-1) : 1);
                currentTarget.classList.toggle("active");
            },
            undo,
        })
    };

    const currentUserData = (props, otherwise = "") =>
        path(["currentUser", ...props])(this.model) || otherwise;

    const isAuthor = meta.author === currentUserData(["username"]);

    const post = createElement("li", {
        "data-id-post": "",
        "data-post-id": id,
        children: [
            ["div", {
                class: "score",
                children: [
                    ["button", {
                        class: meta.upvotes.includes(currentUserData(["id"])) ? "active" : "",
                        onClick: handleVote,
                        children: "thumb_up"
                    }],
                    ["span", {
                        "data-id-upvotes": "",
                        onClick() { showUpvotes(meta) },
                        children: meta.upvotes.length
                    }]
                ]
            }],
            ["div", {
                class: "thumbnail",
                children: (
                    thumbnail
                        ? [
                            ["img", {
                                onClick() { window.open(`data:image/png;base64,${image}`) },
                                title: "View full-size image",
                                src: `data:image/png;base64,${thumbnail}`
                            }]
                        ]
                        : []
                )
            }],
            ["article", {
                class: "info",
                children: [
                    ["a", {
                        "data-id-subseddit": "",
                        href: `#/s/${meta.subseddit}`,
                        children: meta.subseddit
                    }],
                    ["div", {
                        class: "title",
                        children: [
                            ["h2", {
                                "data-id-title": "",
                                children: title
                            }]
                        ]
                    }],
                    ["p", {
                        children: text
                    }],
                    ["footer", {
                        children: [
                            ["a", {
                                "data-id-author": "",
                                rel: "author",
                                href: `#/profile/${meta.author}`,
                                children: meta.author
                            }],
                            ["time", {
                                children: toRelativeTime(meta.published * 1000)
                            }],
                            ["a", {
                                "data-num-comments": comments.length,
                                class: "comments",
                                href: `#/post/${id}`,
                                children: `view comments`
                            }],
                            ["button", {
                                class: `edit ${isAuthor ? "" : "hidden"}`,
                                onClick() { route.editPost(id) },
                                children: "Edit"
                            }],
                            ["button", {
                                class: `delete ${isAuthor ? "" : "hidden"}`,
                                onClick: () => this.update("POST_DELETE", { id }),
                                children: "Delete"
                            }]
                        ]
                    }]
                ]
            }]
        ]
    });

    return post;
};
