export function fromEntries(iterable) {
    const obj = {};
    for (const [key, val] of iterable) {
        obj[key] = val;
    }
    return obj;
}
