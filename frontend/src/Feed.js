import AppHeader from "./AppHeader.js";

const showUpvotes = ({ apiUrl, token }, { upvotes }) => async () => {
    if (!upvotes) return;

    const modal = document.createElement("dialog");

    const close = document.createElement("button");
    close.textContent = "Close";
    close.addEventListener("click", () => {
        modal.close();
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
    document.body.append(modal);
    modal.showModal();
};

const loadFeed = async (model, feed) => {
    const endpoint =
        model.token === null
            ? `http://${model.apiUrl}/post/public`  // public
            : new Request(`http://${model.apiUrl}/user/feed`, {
                headers: {
                    "Authorization": `Token ${model.token}`
                }
            });

    console.log("ENDPOINT:", endpoint);

    const response = await fetch(endpoint);
    const { posts } = await response.json();

    posts.forEach(({ meta, title, thumbnail, text }) => {
        const post = document.createElement("li");
        post.setAttribute("data-id-post", "");

        const author = document.createElement("span");
        author.setAttribute("data-id-author", "");
        author.textContent = meta.author;

        const published = document.createElement("time");
        published.textContent = meta.published;

        const image = document.createElement("img");
        //image.src = thumbnail;

        const upvotes = document.createElement("span");
        upvotes.setAttribute("data-id-upvotes", "")
        upvotes.textContent = `${meta.upvotes.length} upvotes`;
        upvotes.addEventListener("click", showUpvotes(model, meta));

        const postTitle = document.createElement("title");
        postTitle.setAttribute("data-id-title", "");
        postTitle.textContent = title;

        const postText = document.createElement("p");
        postText.textContent = text;

        const numComments = document.createElement("span");
        numComments.textContent = `${meta.comments ? meta.comments.length : 0} comments`;

        const subseddit = document.createElement("span");
        subseddit.textContent = meta.subseddit;

        post.append(author, published, image, upvotes, postTitle, postText, numComments, subseddit);

        feed.append(post);
    });
};

export default (model, update) => {
    const container = document.createElement("div");

    const header = AppHeader(model, update);

    const feed = document.createElement("ul");
    feed.id = "feed";

    loadFeed(model, feed);

    container.append(header, feed);

    return container;
};