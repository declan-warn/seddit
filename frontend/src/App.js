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
                localStorage.setItem("token", payload.token);

                const response = await fetch(`http://${this.model.apiUrl}/user`, {
                    headers: {
                        "Authorization": `Token ${this.model.token}`
                    }
                });

                const json = await response.json();
                if (response.status === 200) {
                    this.model.currentUser = json;
                } else {
                    alert(json.message);
                }

                
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
                const method =
                    payload.id
                        ? "PUT"
                        : "POST";

                const data = Object.fromEntries(
                    Object.entries(payload).filter(([, val]) => val !== "")
                );

                console.log(method, JSON.stringify(data));

                const response = await fetch(`http://${this.model.apiUrl}/post?id=${payload.id}`, {
                    method,
                    body: JSON.stringify(data),
                    headers: {
                        "Authorization": `Token ${this.model.token}`,
                        "Content-Type": "application/json",
                    },
                });

                const json = await response.json();
                
                if (response.status === 200) {
                    console.log(json);
                } else {
                    alert(json.message);
                }
                
                break;
            }

            case "VOTE_ATTEMPT":
                payload.toggleIndicator();

                const response = await fetch(`http://${this.model.apiUrl}/post/vote?id=${payload.id}`, {
                    method: payload.undo ? "DELETE" : "PUT",
                    headers: {
                        "Authorization": `Token ${this.model.token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status !== 200) {
                    payload.toggleIndicator();
                    const { message } = await response.json();
                    alert(message);
                }

                break;

            case "SIGNOUT":
                this.model.token = null;
                localStorage.removeItem("token");
                this.model.route = "front";
                this.renderDOM();
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
                const response = await fetch(
                    `http://${this.model.apiUrl}/user/follow?username=${payload.username}`,
                    ({
                        method: "PUT", 
                        headers: {
                            "Authorization": `Token ${this.model.token}`,
                        }
                    })
                );
                if (response.status === 200) {
                    // TODO: update indicator
                    console.log("SUCCESS! Now following", payload.username);
                } else {
                    const { message } = await response.json();
                    alert(message);
                }
                break;
            }

            case "POST_DELETE": {
                const response = await fetch(
                    `http://${this.model.apiUrl}/post?id=${payload.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Token ${this.model.token}`,
                        }
                    }
                );
                if (response.status === 200) {
                    this.update("FRONT_SHOW");
                } else {
                    const { message } = await response.json();
                    alert(message);
                }
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
        for (const child of this.node.children) {
            this.node.removeChild(child);
        }
        const component = this.render();
        this.node.appendChild(component(this.model, this.update));
    }

}