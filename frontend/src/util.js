// Based on function from lectures
// https://comp2041unsw.github.io/js/render.html?l=js&c=lectures/lecture6/base64/index.js
export const toDataURL = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export const toRelativeTime = timestamp => {
    const diff = new Date(Date.now() - Number(timestamp));

    if (diff.getUTCFullYear() > 1970) {
        return `${diff.getUTCFullYear() - 1970} years ago`;
    } else if (diff.getUTCMonth() > 0) {
        return `${diff.getUTCMonth()} months ago`;
    } else if (diff.getUTCDate() > 1) {
        const weeks = Math.floor(diff.getUTCDate() / 7);
        if (weeks > 0) {
            return `${weeks} weeks ago`;
        } else {
            return `${diff.getUTCDate() - 1} days ago`;
        }
    } else if (diff.getUTCHours() > 0) {
        return `${diff.getUTCHours()} hours ago`;
    } else if (diff.getUTCMinutes() > 0) {
        return `${diff.getUTCMinutes()} minutes ago`;
    } else {
        return "just then";
    }
};

export function createElement(type, attributes = {}) {
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

export const removeImageData = obj => {
    const copy = { ...obj };
    delete copy.thumbnail;
    delete copy.image;
    return copy;
};

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
                    children: [
                        ["span", {
                            children
                        }]
                    ]
                }]
            ]
        }
    ));
};
