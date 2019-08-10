// Utilities
import APIWrapper from "/src/api.js";

// Components
import Feed from "/src/component/Feed.js";
import FeedItem from "/src/component/FeedItem.js";
import LoginForm from "/src/component/LoginForm.js";
import Post from "/src/component/Post.js";
import Profile from "/src/Profile.js";
import SignupForm from "/src/component/SignupForm.js";
import SubmitForm from "/src/component/SubmitForm.js";

export default class App {
    constructor(apiUrl, node) {
        this.node = node;

        const storedModel = JSON.parse(localStorage.getItem("model"));
        this.model = {
            currentUser: {},
            token: null,
            ...storedModel,
            apiUrl,
        };

        this.api = new APIWrapper(this.model, apiUrl);

        this.worker = new Worker("/src/worker.js");
        console.log(this.worker);
        this.worker.postMessage(["SET_API_URL", this.model.apiUrl]);
        this.worker.postMessage(["UPDATE_TOKEN", this.model.token]);

        // This method is passed around a lot so we need to bind it
        // so it doesn't lose its 'this' context
        this.update = this.update.bind(this);
        this.handleRouting = this.handleRouting.bind(this);
        this.scrollFeed = this.scrollFeed.bind(this);

        this.handleRouting();

        // for debugging
        window.app = this;
        
        // event listener used to handle routing
        window.addEventListener("hashchange", this.handleRouting);

        // event listener used for infinite scrolling
        window.addEventListener("scroll", this.scrollFeed);
    }

    async update(msg, payload = {}) {
        switch (msg) {
            case "VIEW_FRONT":
            case "FRONT_SHOW": {
                const { posts } = await this.api.post.getPublic();

                this.model.route = "front";
                this.model.routeData =
                    posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));

                this.renderDOM();
                break;
            }

            case "VIEW_FEED":
            case "FEED_SHOW": {
                const { posts } = await this.api.user.getFeed();

                this.model.route = "front";
                this.model.routeData =
                    posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));

                this.scrollFeed.current = 1;
                this.scrollFeed.checked = 1;

                this.renderDOM();
                break;
            }

            case "VIEW_LOGIN":
            case "LOGIN_SHOW":
                this.model.route = "login";
                this.renderDOM();
                break;

            case "LOGIN_SUCCESS": {
                this.model.token = payload.token;
                this.model.currentUser = await this.api.user.get();
                this.update("FEED_SHOW");
                break;
            }

            case "VIEW_SIGNUP":
            case "SIGNUP_SHOW":
                this.model.route = "signup";
                this.renderDOM();
                break;

            case "SUBMIT_SHOW":
                this.model.route = "submit";
                this.model.routeData = {};
                this.renderDOM();
                break;

            case "SUBMIT_SUCCESS":
                this.update("FRONT_SHOW");
                break;

            case "VIEW_POST":
            case "POST_VIEW":
                if (payload.forceUpdate) {
                    this.model.routeData =
                        await this.api.post.get(payload.id);
                } else {
                    this.model.routeData =
                        this.model.routeData.find(({ id }) => id === payload.id);
                }

                this.model.route = "post";
                this.model.postId = payload.id;
                this.renderDOM();
                break;

            case "POST_EDIT":
                this.model.route = "submit";
                this.model.routeData =
                    this.model.routeData.find(({ id }) => id === payload.id);
                this.renderDOM();
                break;

            case "POST_SUBMIT": {
                const body = Object.fromEntries(
                    Object.entries(payload).filter(([, val]) => val !== "")
                );

                if (payload.id) {
                    await this.api.post.update(payload.id, body);
                } else {
                    await this.api.post.submit(body);
                }

                this.update("FRONT_SHOW");
                break;
            }

            case "VOTE_ATTEMPT":
                payload.toggleIndicator();
                try {
                    await this.api.post.vote(payload.id, payload.undo);
                } catch (error) {
                    payload.toggleIndicator();
                }

                break;

            case "SIGNOUT":
                this.model.token = null;
                this.model.currentUser = {};
                window.location.hash = "#/front";
                break;

            case "VIEW_PROFILE":
            case "PROFILE_SHOW": {
                const userData = await this.api.user.get(payload);
                const posts = await Promise.all(
                    userData.posts.map(this.api.post.get)
                );

                this.model.route = "profile";
                this.model.userId = payload.id;
                this.model.routeData = { ...userData, posts };
                this.renderDOM();

                break;
            }

            case "FOLLOW_USER": {
                await this.api.user.follow(payload.username);
                break;
            }

            case "POST_DELETE": {
                await this.api.post.delete(payload.id);
                this.update("FRONT_SHOW");
                break;
            }

            case "COMMENT_SUBMIT": {
                await this.api.post.comment(payload.id, payload.body);
                this.update("POST_VIEW", {
                    id: payload.id,
                    forceUpdate: true,
                });
                break;
            }

            case "VIEW_SUBSEDDIT": {
                const { posts } = await this.api.user.getFeed();
                console.log(posts);

                break;
            }

            case "AUTH_LOGIN": {
                const { token } = await this.api.auth.login(payload);
                this.update("AUTH_SUCCESS", token);
                break;
            }

            case "AUTH_SIGNUP": {
                const { token } = await this.api.auth.signup(payload);
                this.update("AUTH_SUCCESS", token);
                break;
            }

            case "AUTH_SUCCESS": {
                this.model.token = payload;
                this.model.currentUser = await this.api.user.get();
                this.update("FEED_SHOW");
                break;
            }

            default:
                throw new Error(`Unknown msg '${msg}'.`);
        }

        console.log("setting model");
        localStorage.setItem("model", JSON.stringify(this.model));
    }

    render() {
        const { route } = this.model;
        switch (route) {
            case "front":
                return Feed;

            case "login":
                return LoginForm;

            case "signup":
                return SignupForm;

            case "submit":
                return SubmitForm;

            case "profile":
                return Profile;

            case "post":
                return Post;

            default:
                throw new Error(`Unknown route '${route}'.`);
        }
    }

    renderDOM() {
        while (this.node.firstElementChild) {
            this.node.firstElementChild.remove();
        }
        const component = this.render();
        this.node.appendChild(component(this.model, this.update));
    }

    handleRouting(event) {
        console.log(event);

        const [route, ...args] =
            window.location.hash
                .split("/")
                .slice(1);

        console.log("ROUTE:", route, args);

        switch (route) {
            case "login":
                this.update("VIEW_LOGIN");
                break;

            case "signup":
                this.update("VIEW_SIGNUP");
                break;

            case "feed":
                this.update("VIEW_FEED");
                break;

            case "profile":
                this.update("VIEW_PROFILE", { username: args[0] });
                break;

            case "post":
                this.update("VIEW_POST", { id: Number(args[0]) });
                break;

            case "s":
                const subseddit = args.join("/");
                if (subseddit === "all") {
                    this.update("VIEW_FRONT");
                } else {
                    this.update("VIEW_SUBSEDDIT", subseddit);
                }
                break;

            case "front":
            default:
                this.update("VIEW_FRONT");
                break;
        }
    }

    async scrollFeed() {
        if (this.model.route === "front") {
            const scrollPercentage =
                (window.scrollY + window.innerHeight) / document.body.scrollHeight;

            if (scrollPercentage > 0.6 && this.scrollFeed.current === this.scrollFeed.checked) {
                this.scrollFeed.checked++;
                const { posts } =
                    await this.api.user.getFeed({ page: this.scrollFeed.checked });
                if (posts.length > 0) {
                    this.scrollFeed.current++;
                }

                const feed = document.getElementById("feed");
                posts.forEach(post =>
                    feed.append(FeedItem(this.model, this.update, post))
                );
                console.log(posts);
            }
        }
    }

}
