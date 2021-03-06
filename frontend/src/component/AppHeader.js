import { createElement } from "/src/util.js";
import * as route from "/src/route.js";

export const withHeader = (context, component) =>
    createElement(
        "div", {
            children: [
                AppHeader.call(context),
                component
            ]
        }
    );

export default function AppHeader() {
    const handleSearch = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const query = formData.get("search");

        route.search(query);
    };

    const viewSubseddit = (event) => {
        event.preventDefault();

        const subseddit =
            event.currentTarget
                .querySelector("input")
                .value;

        route.subseddit(subseddit);
    };

    const navLeft = createElement(
        "nav", {
            class: "left",
            children: [
                ["button", {
                    onClick() { route.front() },
                    children: "Front Page"
                }],
                ["form", {
                    class: `subseddit ${this.model.token === null && "hidden"}`,
                    onSubmit: viewSubseddit,
                    onFocusin({ currentTarget }) { currentTarget.classList.add("active") },
                    onFocusout({ currentTarget }) { currentTarget.classList.remove("active") },
                    children: [
                        ["button", {
                            class: "feed",
                            type: "button",
                            onClick() { route.feed() },
                            children: "Feed"
                        }],
                        ["input", {
                            required: "",
                            pattern: "^[^/]+$",
                            placeholder: "Subseddit"
                        }],
                        ["button", {
                            children: "launch"
                        }]
                    ]
                }],
                ["form", {
                    class: `search ${this.model.token === null && "hidden"}`,
                    onSubmit: handleSearch,
                    onFocusin({ currentTarget }) { currentTarget.classList.add("active") },
                    onFocusout({ currentTarget }) { currentTarget.classList.remove("active") },
                    children: [
                        ["input", {
                            name: "search",
                            placeholder: "Search title, text, comments",
                            required: ""
                        }],
                        ["button", {
                            children: "search"
                        }]
                    ]
                }]
            ]
        }
    );

    const navRight = createElement(
        "nav", {
            class: "right",
            children:
                this.model.token === null
                    ? [
                        ["button", {
                            "data-id-login": "",
                            onClick() { route.login() },
                            children: "Log In"
                        }],
                        ["button", {
                            "data-id-signup": "",
                            onClick() { route.signup() },
                            children: "Sign Up"
                        }]
                    ] : [
                        ["button", {
                            id: "nav-submit",
                            onClick() { route.submit() },
                            children: "Add Post"
                        }],
                        ["button", {
                            id: "nav-profile",
                            onClick() { route.profile() },
                            children: "Profile"
                        }],
                        ["button", {
                            id: "nav-signout",
                            onClick() { route.signout() },
                            children: "Sign Out"
                        }]
                    ]
        }
    );

    return createElement(
        "header", {
            id: "nav",
            class: "nav-bar",
            children: [
                ["div", {
                    children: [
                        navLeft,
                        navRight
                    ]
                }]
            ]
        }
    );
};
