import { withHeader } from "/src/component/AppHeader.js";

import { createElement } from "/src/util.js";
import FeedItem from "/src/component/FeedItem.js";

export default (model, update) => {
    const username = model.routeData.username;
    const upvotes =
        model.routeData.posts
            .map(post => post.meta.upvotes.length)
            .reduce((sum, val) => sum + val, 0);

    console.log("UPVOTES: ", upvotes);

    const info = createElement(
        "main", {
            class: "profile",
            children: [
                ["section", {
                    class: "info",
                    children: [
                        ["h2", {
                            children: username
                        }],
                        ["div", {
                            children: [
                                ["button", {
                                    class: "follow",
                                    onClick() { update("FOLLOW_USER", { username }) },
                                    children: "Follow"
                                }],
                                ["span", {
                                    class: "name",
                                    title: "name",
                                    children: model.routeData.name
                                }],
                                ["span", {
                                    class: "email",
                                    title: "email",
                                    children: model.routeData.email
                                }],
                                ["section", {
                                    class: "metrics",
                                    children: [
                                        ["span", {
                                            class: "followers",
                                            children: `${model.routeData.followed_num}`
                                        }],
                                        ["span", {
                                            class: "upvotes",
                                            children: `${upvotes}`
                                        }]
                                    ]
                                }]
                            ]
                        }]                        
                    ]
                }],
                ["section", {
                    "data-id-profile-posts": "",
                    children: model.routeData.posts.map(post =>
                        FeedItem(model, update, post)
                    )
                }]
            ]
    });

    return withHeader(model, update, info);
};
