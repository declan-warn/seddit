import AppHeader from "./AppHeader.js";

export default class App {
    constructor(apiUrl, node) {
        this.node = node;
        this.model = {
            apiUrl,
            route: "home",
        }
        
        this.update = this.update.bind(this);

        this.renderDOM();
    }

    update(msg, payload={}) {
        switch (msg) {
            case "LOGIN_SHOW":
                this.model.route = "login";
                this.renderDOM();
                break;

            default:
                throw new Error(`Unknown msg '${msg}'.`);
        }
    }

    render() {
        const { route } = this.model;
        switch (route) {
            case "home":
                const header = AppHeader(this.model, this.update);
                return header;

            default:
                throw new Error(`Unknown route '${route}'.`);
        }
    }

    renderDOM() {
        Array.prototype.forEach.call(this.node, this.node.removeChild.bind(this));
        this.node.appendChild(this.render());
    }

}