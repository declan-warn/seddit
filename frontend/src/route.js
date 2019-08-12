import Feed from "/src/component/Feed.js";
import FeedItem from "/src/component/FeedItem.js";
import Loading from "/src/component/Loading.js";
import LoginForm from "/src/component/LoginForm.js";
import Post from "/src/component/Post.js";
import Profile from "/src/component/Profile.js";
import ProfileForm from "/src/component/ProfileForm.js";
import SignupForm from "/src/component/SignupForm.js";
import SubmitForm from "/src/component/SubmitForm.js";

import { byPublished } from "/src/util.js";

export const refresh = () => {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
};

const go = route => {
    const hash = `#/${route}`;
    if (window.location.hash === hash) {
        refresh();
    } else {
        window.location.hash = hash;
    }
};

const FRONT = "front";
export const front = () => go(FRONT);

const SUBSEDDIT = "s";
export const subseddit = name => go(`${SUBSEDDIT}/${name}`);

const FEED = "s/all";
export const feed = () => go(FEED);

const PROFILE = "profile";
export const profile = (username = "") => go(`${PROFILE}/${username}`);

const POST = "post";
export const post = id => go(`${POST}/${id}`);
export const editPost = id => go(`${POST}/${id}/edit`);

const LOGIN = "login";
export const login = () => go(LOGIN);

const SIGNUP = "signup";
export const signup = () => go(SIGNUP);

const SIGNOUT = "signout";
export const signout = () => go(SIGNOUT);

const SUBMIT = "submit";
export const submit = () => go(SUBMIT);

const SEARCH = "search";
export const search = (query = "") => go(`${SEARCH}/${encodeURIComponent(query)}`);

const restrictedRoutes = [
    FEED,
    POST,
    PROFILE,
    SEARCH,
    SIGNOUT,
    SUBMIT,
    SUBSEDDIT,
];

export async function handleRouting() {
    const [routeName, ...args] =
        window.location.hash
            .split("/")
            .slice(1);

    // Check user authentication
    if (!this.isAuthenticated() && restrictedRoutes.includes(routeName)) {
        return login();
    }

    // Show a loading spinner while we load the actual destination
    this.render(Loading);

    switch (routeName) {
        case FRONT: {
            const { posts } = await this.api.post.getPublic();
            posts.sort(byPublished);

            this.update("UPDATE_ROUTE_DATA", posts);
            this.render(Feed);
            
            break;
        }

        case LOGIN:
            this.render(LoginForm);
            break;

        case SIGNUP:
            this.render(SignupForm);
            break;      

        case PROFILE: {
            if (!args[0]) {
                profile(this.model.currentUser.username);
                return;
            }

            if (args[1] === "edit") {
                this.update("UPDATE_ROUTE_DATA", await this.api.user.get());
                this.render(ProfileForm);
            } else {
                const userData = await this.api.user.get({ username: args[0] });
                const posts = await Promise.all(
                    userData.posts.map(this.api.post.get)
                );

                posts.sort(byPublished);

                this.update("UPDATE_ROUTE_DATA", { ...userData, posts });
                this.render(Profile);
            }

            break;
        }

        case SUBMIT:
            await this.update("UPDATE_ROUTE_DATA");
            this.render(SubmitForm);
            break;

        case POST: {
            const post = await this.api.post.get(Number(args[0]));
            this.update("UPDATE_ROUTE_DATA", post);
            this.render(
                args[1] === "edit"
                    ? SubmitForm
                    : Post
            );
            break;
        }

        case SUBSEDDIT: {
            const subseddit = args[0];
            if (subseddit === "all") {
                const { posts } = await this.api.user.getFeed();
                posts.sort(byPublished);

                this.scrollFeed.current = 1;
                this.scrollFeed.checked = 1;

                this.update("UPDATE_ROUTE_DATA", posts);
                this.render(Feed);
            } else {
                let page = 1;
                const routeData = [];
                while (true) {
                    const { posts } = await this.api.user.getFeed({ page });
                    page++;
                    if (posts.length === 0) break;

                    posts
                        .filter(post => post.meta.subseddit === subseddit)
                        .sort(byPublished)
                        .forEach(post => routeData.push(post));
                }

                this.update("UPDATE_ROUTE_DATA", routeData);
                this.render(Feed);
            }
            break;
        }

        case SEARCH: {
            const query = decodeURIComponent(args[0]).toLowerCase();

            let page = 1;
            const routeData = [];
            while (true) {
                const { posts } = await this.api.user.getFeed({ page });
                page++;
                if (posts.length === 0) break;

                posts
                    .filter(post =>
                        post.title.toLowerCase().includes(query) ||
                        post.text.toLowerCase().includes(query) ||
                        post.comments.some(({ comment }) => comment.toLowerCase().includes(query))
                    )
                    .sort(byPublished)
                    .forEach(post => routeData.push(post));
            }
            
            this.update("UPDATE_ROUTE_DATA", routeData);
            this.render(Feed);

            break;
        }

        case SIGNOUT: {
            this.update("SIGNOUT");
            break;
        }

        default:
            front();
            break;
    }

    window.scrollTo(0, 0);
}
