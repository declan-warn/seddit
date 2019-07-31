import { toRelativeTime } from "/src/util.js";

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
    const post = document.createElement("li");
    post.setAttribute("data-id-post", "");
    
    const voteScore = document.createElement("span");
    voteScore.setAttribute("data-id-upvotes", "")
    voteScore.textContent = meta.upvotes.length;
    voteScore.addEventListener("click", showUpvotes(model, meta));
    
    const voteUp = document.createElement("button");
    voteUp.textContent = "thumb_up";
    voteUp.addEventListener("click", () => update("VOTE_ATTEMPT", {
        id,
        onSuccess: voteUp.classList.toggle.bind(voteUp.classList, "active"),
        undo: voteUp.classList.contains("active"),
    }));
    if (meta.upvotes.includes(model.currentUserId)) {
        voteUp.classList.add("active");
    }
    
    const voteContainer = document.createElement("div");
    voteContainer.classList.add("score");
    voteContainer.append(voteUp, voteScore);
    
    const author = document.createElement("span");
    author.setAttribute("data-id-author", "");
    author.textContent = meta.author;
    author.addEventListener("click", () => update("PROFILE_SHOW", { username: meta.author }))

    const published = document.createElement("time");
    published.textContent = toRelativeTime(meta.published * 1000);

    const image = document.createElement("img");
    image.src =
        thumbnail
            ? `data:image/png;base64,${thumbnail}`
            : "";

    const postTitle = document.createElement("h2");
    postTitle.setAttribute("data-id-title", "");
    postTitle.textContent = title;

    const postText = document.createElement("p");
    postText.textContent = text;

    const numComments = document.createElement("span");
    numComments.classList.add("comments");
    numComments.textContent = `${comments.length} comments`;
    numComments.addEventListener("click", () => update("POST_VIEW", { id }));

    const subseddit = document.createElement("span");
    subseddit.setAttribute("data-id-subseddit", "")
    subseddit.textContent = meta.subseddit;

    const info = document.createElement("article");
    info.classList.add("info");
    info.append(image, postTitle, postText, subseddit, author, published, numComments);

    post.append(info, voteContainer);

    return post;
};