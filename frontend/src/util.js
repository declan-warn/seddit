// Based on function from lectures
// https://comp2041unsw.github.io/js/render.html?l=js&c=lectures/lecture6/base64/index.js
export const toDataURL = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

// Will convert a timestring to a human-readable format.
// The output is how long ago the given time occurred relative to now.
export const toRelativeTime = timestamp => {
    const diff = new Date(Date.now() - Number(timestamp));

    if (diff.getUTCFullYear() > 1970) {
        return `${diff.getUTCFullYear() - 1970} year(s) ago`;
    } else if (diff.getUTCMonth() > 0) {
        return `${diff.getUTCMonth()} month(s) ago`;
    } else if (diff.getUTCDate() > 1) {
        const weeks = Math.floor(diff.getUTCDate() / 7);
        if (weeks > 0) {
            return `${weeks} week(s) ago`;
        } else {
            return `${diff.getUTCDate() - 1} day(s) ago`;
        }
    } else if (diff.getUTCHours() > 0) {
        return `${diff.getUTCHours()} hour(s) ago`;
    } else if (diff.getUTCMinutes() > 0) {
        return `${diff.getUTCMinutes()} minute(s) ago`;
    } else {
        return "just then";
    }
};

// Utility method to create HTML elements more easily
export const createElement = (type, attributes = {}) => {
    const element = document.createElement(type);
    for (const [key, val] of Object.entries(attributes)) {
        switch (key) {
            case "children":
                if (["string", "number"].includes(typeof val)) {
                    element.textContent = val;
                } else {
                    val
                        .map(args => args instanceof HTMLElement ? args : createElement(...args))
                        .forEach(child => element.append(child));
                }
                break;

            case "onClick":
            case "onSubmit":
            case "onFocusin":
            case "onFocusout":
                const method = key.replace(/^on/, "").toLowerCase();
                element.addEventListener(method, val);
                break;

            default:
                element.setAttribute(key, val);
        }
    }
    return element;
}

// Implements https://ramdajs.com/docs/#path
// Code my own
export const path = props => obj => props.reduce(
    (acc, prop) => {
        if (acc !== null && acc !== undefined && acc.hasOwnProperty(prop)) {
            return acc[prop];
        } else {
            return undefined;
        }
    },
    obj
);

export const showModal = (...children) => {
    document.body.classList.add("scrolling-disabled");

    const closeModal = ({ target, currentTarget }) => {
        if (target === currentTarget) {
            currentTarget.remove();
            document.body.classList.remove("scrolling-disabled");
        }
    };

    document.body.append(createElement(
        "div", {
            onClick: closeModal,
            class: "modal",
            children: [
                ["div", {
                    class: "modal-container",
                    children
                }]
            ]
        }
    ));
};

// Sorthing method to sort by published property
export const byPublished = (a, b) => Number(b.meta.published) - Number(a.meta.published);
