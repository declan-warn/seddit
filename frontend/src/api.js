// Using ES6 class syntax would be preferable but
// doesn't allow for namespacing the api methods as easily
export default function APIWrapper(model, apiUrl) {
    this.apiUrl = apiUrl;
    
    // Normalise the given apiUrl
    this.baseUrl =
        apiUrl.includes("://")
            ? apiUrl
            : `http://${apiUrl}`
                .replace(/\/*$/, "");

    const request = async (path, options = {}) => {
        const params = new URLSearchParams(options.params);
        const headers = new Headers(options.headers);

        // Specify the authorization header
        if (options.authorized) {
            headers.set("Authorization", `Token ${model.token}`);
        }

        // Specify the content type header
        if (options.body) {
            headers.set("Content-Type", "application/json");
        }

        // Perform the request
        const response =
            await fetch(`${this.baseUrl}${path}?${params.toString()}`, {
                method: options.method,
                body: JSON.stringify(options.body),
                headers,
            });

        // If the status code wasn't a success then throw an error
        // that we can handle somewhere more relevant
        if (response.status !== 200) {
            const { message } = await response.json();

            const error = new Error(message);
            error.status = response.status;
            throw error;
        }

        return response;
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

    this.auth = {
        login: (body) => requestJSON("/auth/login", {
            method: "POST",
            authorized: false,
            body,
        }),
        signup: (body) => requestJSON("/auth/signup", {
            method: "POST",
            authorized: false,
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
        }),
        unfollow: (username) => requestJSON("/user/unfollow", {
            method: "PUT",
            authorized: true,
            params: { username },
        }),
        update: (body) => requestJSON("/user", {
            method: "PUT",
            authorized: true,
            body,
        }),
    };
}
