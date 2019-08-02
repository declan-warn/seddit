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
            }]
        ]
    });

    const navRight = createElement("nav", {
        class: "right",
        children:
            model.token === null
                ? [
                    ["button", {
                        "data-id-login": "",
                        onClick() { update("LOGIN_SHOW") },
                        children: "Log In"
                    }],
                    ["button", {
                        "data-id-signup": "",
                        onClick() { update("SIGNUP_SHOW") },
                        children: "Sign Up"
                    }]
                ] : [
                    ["button", {
                        onClick() { update("SUBMIT_SHOW") },
                        children: "Add Post"
                    }],
                    ["button", {
                        onClick() { update("PROFILE_SHOW", { id: model.currentUser.id }) },
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