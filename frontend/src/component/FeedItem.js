import { createElement, toRelativeTime } from "/src/util.js";

const showUpvotes = ({ apiUrl, token }, { upvotes }) => async () => {
    if (!upvotes) return;

    const modal = document.createElement("dialog");

    const close = document.createElement("button");
    close.textContent = "Close";
    close.addEventListener("click", () => {
        modal.close();
        modal.parentNode.removeChild(modal);
    });
    modal.append(close);

    const list = document.createElement("ul");

    const users = await Promise.all(upvotes.map(userId =>
        fetch(`http://${apiUrl}/dummy/user?id=${userId}`)
            .then(x => x.json())
    ));

    users.forEach(({ username }) => {
        const user = document.createElement("li");
        user.textContent = username;
        list.append(user);
    });

    modal.append(list);
    document.getElementById("root").append(modal);
    modal.showModal();
};

export default (model, update, { id, meta, title, text, thumbnail, comments }) => {
    const handleVote = ({ currentTarget }) => {
        update("VOTE_ATTEMPT", {
            id,
            toggleIndicator() { currentTarget.classList.toggle("active") },
            undo: currentTarget.classList.contains("active"),
        })
    };

    const post = createElement("li", {
        "data-id-post": "",
        children: [
            ["article", {
                class: "info",
                children: [
                    ["h2", {
                        "data-id-title": "",
                        children: title
                    }],
                    ["p", {
                        children: text
                    }],
                    ["img", {
                        src: thumbnail ? `data:image/png;base64,${thumbnail}` : ""
                    }],
                    ["span", {
                        "data-id-subseddit": "",
                        children: meta.subseddit
                    }],
                    ["a", {
                        "data-id-author": "",
                        rel: "author",
                        onClick() { update("PROFILE_SHOW", { username: meta.author }) },
                        children: meta.author
                    }],
                    ["time", {
                        children: toRelativeTime(meta.published * 1000)
                    }],
                    ["a", {
                        class: "comments",
                        onClick() { update("POST_VIEW", { id }) },
                        children: `view comments (${comments.length})`
                    }]
                ]
            }],
            ["div", {
                class: "score",
                children: [
                    ["button", {
                        class: meta.upvotes.includes(model.currentUserId) ? "active" : "",
                        onClick: handleVote,
                        children: "thumb_up"
                    }],
                    ["span", {
                        "data-id-upvotes": "",
                        onClick() { showUpvotes(model, meta) },
                        children: meta.upvotes.length
                    }]
                ]
            }]
        ]
    });

    return post;
};