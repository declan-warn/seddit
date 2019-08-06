// Using ES6 class syntax would be preferable but
// doesn't allow for namespacing the api methods as easily
export default function APIWrapper(model, apiUrl) {
    this.apiUrl = apiUrl;
    this.baseUrl =
        apiUrl.includes("://")
            ? apiUrl
            : `http://${apiUrl}`
                .replace(/\/$/, "");

    const request = (path, options = {}) => {
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
            body: JSON.stringify(options.body),
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
        submit: (body) => requestJSON("/post", {
            method: "POST",
            authorized: true,
            body,
        }),
        update: (id, body) => requestJSON("/post", {
            method: "PUT",
            authorized: true,
            params: { id },
            body,
        }),
        vote: (id, undo = false) => requestJSON("/post/vote", {
            method: undo ? "DELETE" : "PUT",
            authorized: true,
            params: { id },
        }),
        delete: (id) => requestJSON("/post", {
            method: "DELETE",
            authorized: true,
            params: { id },
        }),
        comment: (id, body) => requestJSON("/post/comment", {
            method: "PUT",
            authorized: true,
            params: { id },
            body,
        }),
    };

    this.user = {
        get: ({ username, id } = {}) => requestJSON("/user", {
            method: "GET",
            authorized: true,
            params: username && { username } || id && { id } || {},
        }),
        getFeed: ({ page } = { page: 1 }) => requestJSON("/user/feed", {
            method: "GET",
            authorized: true,
            params: { n: 10, p: (page - 1) * 10 },
        }),
        follow: (username) => requestJSON("/user/follow", {
            method: "PUT",
            authorized: true,
            params: { username },
        })
    };
}