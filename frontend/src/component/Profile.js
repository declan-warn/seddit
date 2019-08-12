import { withHeader } from "/src/component/AppHeader.js";
import { createElement, path } from "/src/util.js";

import FeedItem from "/src/component/FeedItem.js";

export default function Profile() {
    const routeData = (props, otherwise = "") =>
        path(["routeData", ...props])(this.model) || otherwise;

    const username = routeData(["username"]);

    // Calculate how many upvotes the user has
    const upvotes =
        routeData(["posts"], [])
            .map(post => post.meta.upvotes.length)
            .reduce((sum, val) => sum + val, 0);

    const isFollowing =
        this.model.currentUser.following.includes(routeData(["id"]));

    const follow = createElement(
        "button", {
            class: isFollowing ? "unfollow" : "follow",
            onClick: ({ currentTarget }) => {
                const isFollowing =
                    currentTarget.classList.contains("follow");

                if (isFollowing) {
                    this.update("FOLLOW_USER", { username });
                    currentTarget.classList.replace("follow", "unfollow");
                    currentTarget.textContent = "Unfollow";
                } else {
                    this.update("UNFOLLOW_USER", { username });
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
            href: `#/profile/${this.model.currentUser.username}/edit`,
            children: "Edit"
        }
    );

    return withHeader(this, createElement(
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
                                (this.model.currentUser.id === routeData(["id"])
                                    ? edit
                                    : follow
                                ),
                                ["span", {
                                    class: "name",
                                    title: "Name",
                                    children: routeData(["name"])
                                }],
                                ["span", {
                                    class: "email",
                                    title: "Email",
                                    children: routeData(["email"])
                                }],
                                ["section", {
                                    class: "metrics",
                                    children: [
                                        ["span", {
                                            class: "followers",
                                            children: `${routeData(["followed_num"])}`
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
                    class: "posts",
                    children: routeData(["posts"], []).map(post =>
                        FeedItem.call(this, post)
                    )
                }]
            ]
        }
    ));
};
