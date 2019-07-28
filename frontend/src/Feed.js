import AppHeader from "./AppHeader.js";

const loadFeed = async (model, feed) => {
    const response = await fetch(`${model.apiUrl}/feed.json`);
    const { posts } = await response.json();

    posts.forEach(({ meta, title, thumbnail, text }) => {
        const post = document.createElement("li");
        post.setAttribute("data-id-post", "");

        post.textContent = `
            ${title}  
        `;

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