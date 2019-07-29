import LoginForm from "./LoginForm.js";
import SignupForm from "./SignupForm.js";
import SubmitForm from "./SubmitForm.js";
import Feed from "./component/Feed.js";
import Profile from "./Profile.js";

export default class App {
    constructor(apiUrl, node) {
        this.node = node;
        this.model = {
            apiUrl,
            route: "front",
            token: localStorage.getItem("token"), 
        }

        this.update = this.update.bind(this);

        this.renderDOM();
    }

    async update(msg, payload = {}) {
        switch (msg) {
            case "LOGIN_SHOW":
                this.model.route = "login";
                this.renderDOM();
                break;

            case "LOGIN_SUCCESS":
                this.model.token = payload.token;
                localStorage.setItem("token", payload.token);
                this.model.route = "front";
                this.renderDOM();
                break;

            case "SIGNUP_SHOW":
                this.model.route = "signup";
                this.renderDOM();
                break;

            case "SUBMIT_SHOW":
                this.model.route = "submit";
                this.renderDOM();
                break;

            case "SUBMIT_SUCCESS":
                this.model.route = "front";
                this.renderDOM();
                break;

            case "VOTE_ATTEMPT":
                // TODO: use logged in version
                const response = await fetch(`http://${this.model.apiUrl}/dummy/post/vote?id=${payload.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status !== 200) {
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

            case "PROFILE_SHOW":
                this.model.route = "profile";
                this.renderDOM();
                break;

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