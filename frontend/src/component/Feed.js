import { withHeader } from "../AppHeader.js";
import FeedItem from "./FeedItem.js";

const loadFeed = async (model, update, feed) => {
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

    posts.forEach(post => feed.append(FeedItem(model, update, post)));
};

export default (model, update) => {
    const container = document.createElement("div");

    const feed = document.createElement("ul");
    feed.id = "feed";

    loadFeed(model, update, feed);

    container.append(feed);

    return withHeader(model, update, container);
};