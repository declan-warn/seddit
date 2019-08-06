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
                    ["input", {
                        placeholder: "subseddit"    
                    }],
                    ["button", {
                        class: "material-icons",
                        children: "search"
                    }]
                ]
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
                        "data-id-search": ""                        
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
                    ["button", {
                        "data-id-login": "",
                        onClick() { window.location.hash = "#/login" },
                        //href: "#/login",
                        children: "Log In"
                    }],
                    ["button", {
                        "data-id-signup": "",
                        onClick() { window.location.hash = "#/signup" },
                        //href: "#/signup",
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
        id: "nav",
        class: "nav-bar",
        children: [
            navLeft,
            navRight
        ]
    });

    return header;
};