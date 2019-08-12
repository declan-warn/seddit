import { createElement, toRelativeTime, path, showModal } from "/src/util.js";
import * as route from "/src/route.js";

const showUpvotes = async ({ apiUrl, token }, { upvotes }) => {
    if (!upvotes) return;

    const users = await Promise.all(upvotes.map(userId =>
        fetch(`http://${apiUrl}/dummy/user?id=${userId}`)
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

export default (model, update, { id, image, meta, title, text, thumbnail, comments }) => {
    const handleVote = ({ currentTarget }) => {
        const undo = currentTarget.classList.contains("active");
        update("VOTE_ATTEMPT", {
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

    const isAuthor = meta.author === path(["currentUser", "username"])(model);

    const post = createElement("li", {
        "data-id-post": "",
        "data-post-id": id,
        children: [
            ["div", {
                class: "score",
                children: [
                    ["button", {
                        class: meta.upvotes.includes(path(["currentUser", "id"])(model)) ? "active" : "",
                        onClick: handleVote,
                        children: "thumb_up"
                    }],
                    ["span", {
                        "data-id-upvotes": "",
                        onClick() { showUpvotes(model, meta) },
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
                                onClick() { update("POST_DELETE", { id }) },
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
