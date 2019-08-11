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
                class: "subseddit",
                onSubmit: viewSubseddit,
                children: [
                    ["button", {
                        class: `feed ${model.token === null && "hidden"}`,
                        type: "button",
                        onClick() { window.location.hash = "#/feed" },
                        children: "Feed"
                    }],
                    ["input", {
                        required: "",
                        pattern: "^[^/]+$",
                        placeholder: "subseddit"
                    }],
                    ["button", {
                        class: "material-icons",
                        children: "search"
                    }]
                ]
            }],
            ["form", {
                class: "search",
                onSubmit: handleSearch,
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
                        onClick() { window.location.hash = "#/submit" },
                        children: "Add Post"
                    }],
                    ["a", {
                        onClick() { window.location.hash = `#/profile/${model.currentUser.username}` },
                        children: "Profile"
                    }],
                    ["button", {
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
