import LoginForm from "./LoginForm.js";
import SignupForm from "./SignupForm.js";
import SubmitForm from "/src/component/SubmitForm.js";
import Feed from "./component/Feed.js";
import Profile from "./Profile.js";
import Post from "./component/Post.js";

import APIWrapper from "/src/api.js";

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

        // This method is passed around a lot so we need to bind it
        // so it doesn't lose its 'this' context
        this.update = this.update.bind(this);

        this.update("FRONT_SHOW");

        // for debugging
        window.app = this;
    }

    async update(msg, payload = {}) {
        switch (msg) {
            case "FRONT_SHOW": {
                const { posts } = await this.api.post.getPublic();

                this.model.route = "front";
                this.model.routeData =
                    posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));

                this.renderDOM();
                break;
            }

            case "FEED_SHOW": {
                const { posts } = await this.api.user.getFeed();

                this.model.route = "front";
                this.model.routeData =
                    posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));

                this.renderDOM();
                break;
            }

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

            case "SIGNUP_SHOW":
                this.model.route = "signup";
                this.renderDOM();
                break;

            case "SUBMIT_SHOW":
                this.model.route = "submit";
                this.model.routeData = {

                };
                this.renderDOM();
                break;

            case "SUBMIT_SUCCESS":
                this.update("FRONT_SHOW");
                break;

            case "POST_VIEW":
                this.model.routeData =
                    this.model.routeData.find(({ id }) => id === payload.id);

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
                this.update("FRONT_SHOW");
                break;

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

}