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

    if (diff.getFullYear() > 1970) {
        return `${diff.getFullYear() - 1970} years ago`;
    } else if (diff.getMonth() > 0) {
        return `${diff.getMonth()} months ago`;
    } else if (diff.getDay() > 0) {
        const weeks = Math.floor(diff.getDay() / 7);
        if (weeks > 0) {
            return `${weeks} weeks ago`;
        } else {
            return `${diff.getDay()} days ago`;
        }
    } else if (diff.getHours() > 0) {
        return `${diff.getHours()} hours ago`;
    } else if (diff.getMinutes() > 0) {
        return `${diff.getMinutes()} minutes ago`;
    } else {
        return "just then";
    }
};

export function createElement(type, attributes, children=[]) {
	const element = document.createElement(type);
  	if (attributes) {
      for (const [key, val] of Object.entries(attributes)) {
          element.setAttribute(key, val);
      }
    }
  	if (typeof children === "string") {
    	element.textContent = children; 
    } else {
      children
          .map(args => createElement(...args))
          .forEach(child => element.append(child));
    }
  	return element;
}