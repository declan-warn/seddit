import { createElement } from "/src/util.js";

export function withHeader(model, update, component) {
    component.prepend(AppHeader(model, update));
    return component;
};

export default function AppHeader(model, update) {
    const navLeft = createElement("nav", {
        class: "left",
        children: [
            ["button", {
                onClick() { update("FRONT_SHOW") },
                children: "Front Page"
            }],
            ["button", {
                class: `${model.token === null && "hidden"}`,
                onClick() { update("FEED_SHOW") },
                children: "Feed"
            }],
            ["form", {
                children: [
                    ["select", {
                        children: [
                            ["option", {
                                children: "a"
                            }]
                        ]
                    }],
                    ["input", {

                    }],
                    ["button", {
                        children: "search"
                    }]
                ]
            }]
        ]
    });

    const navRight = createElement("nav", {
        class: "right",
        children:
            model.token === null
                ? [
                    ["a", {
                        "data-id-login": "",
                        //onClick() { update("LOGIN_SHOW") },
                        href: "#/login",
                        children: "Log In"
                    }],
                    ["a", {
                        "data-id-signup": "",
                        //onClick() { update("SIGNUP_SHOW") },
                        href: "#/signup",
                        children: "Sign Up"
                    }]
                ] : [
                    ["button", {
                        onClick() { update("SUBMIT_SHOW") },
                        children: "Add Post"
                    }],
                    ["a", {
                        //onClick() { update("PROFILE_SHOW", { id: model.currentUser.id }) },
                        href: `#/profile/${model.currentUser.id}`,
                        children: "Profile"
                    }],
                    ["button", {
                        onClick() { update("SIGNOUT") },
                        children: "Sign Out"
                    }]
                ]
    });

    const header = createElement("header", {
        class: "nav-bar",
        children: [
            navLeft,
            navRight
        ]
    });

    return header;
};