const go = route => {
    if (window.location.hash === route) {
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
        window.location.hash = route;
    }
};

const FRONT = "#/front";
export const front = () => go(FRONT);

const SUBSEDDIT = "#/s";
export const subseddit = name => go(`${SUBSEDDIT}/${name}`);

const FEED = "#/s/all";
export const feed = () => go(FEED);

const PROFILE = "#/profile";
export const profile = (username = "") => go(`${PROFILE}/${username}`);

const POST = "#/post";
export const post = id => go(`${POST}/${id}`);
export const editPost = id => go(`${POST}/${id}/edit`);

const LOGIN = "#/login";
export const login = () => go(LOGIN);

const SIGNUP = "#/signup";
export const signup = () => go(SIGNUP);

const SIGNOUT = "#/signout";
export const signout = () => go(SIGNOUT);

const SUBMIT = "#/submit";
export const submit = () => go(SUBMIT);

const SEARCH = "#/search";
export const search = (query = "") => go(`${SEARCH}/${encodeURIComponent(query)}`);
