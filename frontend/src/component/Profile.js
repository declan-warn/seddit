import { withHeader } from "/src/component/AppHeader.js";

import { createElement } from "/src/util.js";
import FeedItem from "/src/component/FeedItem.js";

export default (model, update) => {
    const username = model.routeData.username;
    const upvotes =
        model.routeData.posts
            .map(post => post.meta.upvotes.length)
            .reduce((sum, val) => sum + val, 0);

    const isFollowing =
        model.currentUser.following.includes(model.routeData.id);

    const follow = createElement(
        "button", {
            class: isFollowing ? "unfollow" : "follow",
            async onClick({ currentTarget }) {
                const isFollowing =
                    currentTarget.classList.contains("follow");

                if (isFollowing) {
                    update("FOLLOW_USER", { username });
                    currentTarget.classList.replace("follow", "unfollow");
                    currentTarget.textContent = "Unfollow";
                } else {
                    update("UNFOLLOW_USER", { username });
                    currentTarget.classList.replace("unfollow", "follow");
                    currentTarget.textContent = "Follow";
                }
            },
            children: isFollowing ? "Unfollow" : "Follow"
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
                                    title: "Name",
                                    children: model.routeData.name
                                }],
                                ["span", {
                                    class: "email",
                                    title: "Email",
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
