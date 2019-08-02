// Using ES6 class syntax would be preferable but
// doesn't allow for namespacing the api methods as easily
export default function APIWrapper(model, apiUrl) {
    this.apiUrl = apiUrl;
    this.baseUrl =
        apiUrl.includes("://")
            ? apiUrl
            : `http://${apiUrl}`
                .replace(/\/$/, "");

    const request = (path, options={}) => {
        const params = new URLSearchParams(options.params);
        const headers = new Headers(options.headers);
        
        if (options.authorized) {
            headers.set("Authorization", `Token ${model.token}`);
        }

        if (options.body) {
            headers.set("Content-Type", "application/json");
        }

        return fetch(`${this.baseUrl}${path}?${params.toString()}`, {
            method: options.method,
            body: options.body,
            headers,
        });
    };

    const requestJSON = (...args) => request(...args).then(x => x.json());

    this.post = {
        get: (id) => requestJSON("/post", {
            method: "GET",
            authorized: true,
            params: { id },
        }),
        getPublic: () => requestJSON("/post/public", {
            method: "GET",
            authorized: false,
        }),
    };

    this.user = {
        get: ({ username, id }) => requestJSON("/user", {
            method: "GET",
            authorized: true,
            params: username ? { username } : { id },
        }),
        getFeed: () => requestJSON("/user/feed", {
            method: "GET",
            authorized: true,
        }),
    };
}