import { createElement } from "/src/util.js";

export const withHeader = (model, update, component) =>
    createElement(
        "div", {
            children: [
                AppHeader(model, update),
                component
            ]
        }
    );

export default function AppHeader(model, update) {
    const handleSearch = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        const query = formData.get("search");
    
        window.location.hash = `#/search/${encodeURIComponent(query)}`;
    };

    const navLeft = createElement("nav", {
        class: "left",
        children: [
            ["button", {
                onClick() { window.location.hash = "#/front" },
                children: "Front Page"
            }],
            ["form", {
                class: `subseddit ${model.token === null && "hidden"}`,
                onSubmit: viewSubseddit,
                onFocusin({ currentTarget }) { currentTarget.classList.add("active") },
                onFocusout({ currentTarget }) { currentTarget.classList.remove("active") },
                children: [
                    ["button", {
                        class: "feed",
                        type: "button",
                        onClick() { window.location.hash = "#/feed" },
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
                class: `search ${model.token === null && "hidden"}`,
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
                        id: "nav-submit",
                        onClick() { window.location.hash = "#/submit" },
                        children: "Add Post"
                    }],
                    ["button", {
                        id: "nav-profile",
                        onClick() { window.location.hash = `#/profile/${model.currentUser.username}` },
                        children: "Profile"
                    }],
                    ["button", {
                        id: "nav-signout",
                        onClick() { window.location.hash = "#/signout" },
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

function viewSubseddit(event) {
    event.preventDefault();

    const subseddit =
        event.currentTarget
            .querySelector("input")
            .value;

    window.location.hash =
        `#/s/${subseddit}`;
}
