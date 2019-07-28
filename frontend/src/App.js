import LoginForm from "./LoginForm.js";
import SignupForm from "./SignupForm.js";
import Feed from "./Feed.js";

export default class App {
    constructor(apiUrl, node) {
        this.node = node;
        this.model = {
            apiUrl,
            route: "front",
            token: null,
        }

        this.update = this.update.bind(this);

        this.renderDOM();
    }

    update(msg, payload = {}) {
        switch (msg) {
            case "LOGIN_SHOW":
                this.model.route = "login";
                this.renderDOM();
                break;

            case "LOGIN_SUCCESS":
                this.model.token = payload.token;
                this.model.route = "front";
                this.renderDOM();
                break;

            case "SIGNUP_SHOW":
                this.model.route = "signup";
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

            default:
                throw new Error(`Unknown route '${route}'.`);
        }
    }

    renderDOM() {
        this.node.childNodes.forEach(
            this.node.removeChild.bind(this.node)
        );
        this.node.appendChild(this.render());
    }

}