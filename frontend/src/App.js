import LoginForm from "./LoginForm.js";
import SignupForm from "./SignupForm.js";
import SubmitForm from "/src/component/SubmitForm.js";
import Feed from "./component/Feed.js";
import Profile from "./Profile.js";
import Post from "./component/Post.js";

export default class App {
    constructor(apiUrl, node) {
        this.node = node;
        this.model = {
            apiUrl,
            route: "front",
            token: localStorage.getItem("token"),
            currentUserId: localStorage.getItem("currentUserId")
                && Number(localStorage.getItem("currentUserId")) || null,
            postId: null,
        }

        this.update = this.update.bind(this);

        //this.renderDOM();
        this.update("FRONT_SHOW");

        // for debugging
        window.app = this;
    }

    async update(msg, payload = {}) {
        switch (msg) {
            case "FRONT_SHOW": {
                const response = await fetch(`http://${this.model.apiUrl}/post/public`);
                const { posts } = await response.json();

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

                const { id, message } = await response.json();
                if (response.status === 200) {
                    console.log("ID:", id);
                    this.model.currentUserId = id;
                    localStorage.setItem("currentUserId", id);
                } else {
                    alert(message);
                }

                this.model.route = "front";
                this.renderDOM();
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
                const url = new URL(`http://${this.model.apiUrl}/user`);
                if (payload.id) {
                    url.searchParams.append("id", payload.id);
                } else if (payload.username) {
                    url.searchParams.append("username", payload.username);
                }
                
                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Token ${this.model.token}`
                    }
                });

                const json = await response.json();

                console.log(json);

                this.model.route = "profile";
                this.model.userId = payload.id;
                this.model.routeData = json;

                this.renderDOM();
                break;
            }

            default:
                throw new Error(`Unknown msg '${msg}'.`);
        }
    }

    render() {
        const { route } = this.model;
        switch (route) {
            case "front":
                return Feed(this.model, this.update);

            case "login":
                return LoginForm(this.model, this.update);

            case "signup":
                return SignupForm(this.model, this.update);

            case "submit":
                return SubmitForm(this.model, this.update);

            case "profile":
                return Profile(this.model, this.update);

            case "post":
                return Post(this.model, this.update);

            default:
                throw new Error(`Unknown route '${route}'.`);
        }
    }

    renderDOM() {
        for (const child of this.node.children) {
            this.node.removeChild(child);
        }
        this.node.appendChild(this.render());
    }

}