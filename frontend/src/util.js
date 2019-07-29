// Based on function from lectures
// https://comp2041unsw.github.io/js/render.html?l=js&c=lectures/lecture6/base64/index.js
export const toDataURL = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () =>
        resolve(reader.result.split(",")[1].substr(1));
    reader.onerror = reject;
    reader.readAsDataURL(file);
});