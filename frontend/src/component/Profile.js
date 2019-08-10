import { withHeader } from "/src/component/AppHeader.js";

import { createElement } from "/src/util.js";
import FeedItem from "/src/component/FeedItem.js";

export default (model, update) => {
    const username = model.routeData.username;
    const upvotes =
        model.routeData.posts
            .map(post => post.meta.upvotes.length)
            .reduce((sum, val) => sum + val, 0);

    const follow = createElement(
        "button", {
            class: "follow",
            onClick() { update("FOLLOW_USER", { username }) },
            children: "Follow"
        }
    );

    const edit = createElement(
        "a", {
            class: "edit",
            href: `#/profile/${model.currentUser.username}/edit`,
            children: "Edit"
        }
    );

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
                                (model.currentUser.id === model.routeData.id
                                    ? edit
                                    : follow
                                ),
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
