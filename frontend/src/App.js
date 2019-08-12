// Utilities
import APIWrapper from "/src/api.js";
import * as util from "/src/util.js";
import * as route from "/src/route.js";
import * as polyfill from "/src/polyfill.js";

import FeedItem from "/src/component/FeedItem.js";

// Apply polyfills
Object.fromEntries = Object.fromEntries || polyfill.fromEntries;

export default class App {
    static get POLLING_INTERVAL() {
        return 5000;
    }

    constructor(apiUrl, node) {
        this.node = node;

        const storedModel = JSON.parse(localStorage.getItem("model"));
        this.model = {
            currentUser: null,
            token: null,
            ...storedModel,
            apiUrl,
        };

        this.api = new APIWrapper(this.model, apiUrl);

        // This method is passed around a lot so we need to bind it
        // so it doesn't lose its 'this' context
        this.update = this.update.bind(this);
        this.handleRouting = route.handleRouting.bind(this);
        this.scrollFeed = this.scrollFeed.bind(this);
        this.monitorFeed = this.monitorFeed.bind(this);

        this.handleRouting();

        // for debugging
        window.app = this;

        // event listener used to handle routing
        window.addEventListener("hashchange", this.handleRouting);

        // event listener used for infinite scrolling
        window.addEventListener("scroll", this.scrollFeed);

        // used to periodically check the feed for updates
        this.monitorFeed();
    }

    isAuthenticated() {
        return Boolean(this.model.currentUser && this.model.token);
    }

    async update(msg, payload = {}) {
        switch (msg) {
            case "POST_SUBMIT": {
                const body = Object.fromEntries(
                    Object.entries(payload).filter(([, val]) => val !== "")
                );

                if (payload.id) {
                    await this.api.post.update(payload.id, body);
                } else {
                    await this.api.post.submit(body);
                }

                route.front();
                break;
            }

            case "VOTE_ATTEMPT": {
                if (!this.model.currentUser) {
                    util.showModal(util.createElement(
                        "span", {
                            children: "You must be logged in to upvote posts"
                        }
                    ));
                }

                payload.toggleIndicator();
                try {
                    await this.api.post.vote(payload.id, payload.undo);
                } catch (error) {
                    payload.toggleIndicator();
                }

                break;
            }

            case "SIGNOUT":
                this.model.token = null;
                this.model.currentUser = null;
                route.front();
                break;

            case "FOLLOW_USER": {
                await this.api.user.follow(payload.username);
                this.update("REFRESH_CURRENT_USER");
                break;
            }

            case "UNFOLLOW_USER": {
                await this.api.user.unfollow(payload.username);
                this.update("REFRESH_CURRENT_USER");
                break;
            }

            case "REFRESH_CURRENT_USER": {
                const currentUser = await this.api.user.get();
                this.model.currentUser = currentUser;
                break;
            }

            case "POST_DELETE": {
                await this.api.post.delete(payload.id);
                route.refresh();
                break;
            }

            case "COMMENT_SUBMIT": {
                await this.api.post.comment(payload.id, payload.body);
                route.post(payload.id);
                break;
            }

            case "AUTH_LOGIN": {
                try {
                    const { token } = await this.api.auth.login(payload);
                    this.update("AUTH_SUCCESS", token);
                } catch ({ message }) {
                    alert(message);
                }
                break;
            }

            case "AUTH_SIGNUP": {
                try {
                    const { token } = await this.api.auth.signup(payload);
                    this.update("AUTH_SUCCESS", token);
                } catch ({ message }) {
                    alert(message);
                }
                break;
            }

            case "AUTH_SUCCESS": {
                this.model.token = payload;
                this.model.currentUser = await this.api.user.get();
                route.feed();
                break;
            }

            case "EDIT_PROFILE": {
                if (Object.keys(payload).length >= 1) {
                    await this.api.user.update(payload);
                }
                route.profile();
                break;
            }

            case "UPDATE_ROUTE_DATA": {
                this.model.routeData = payload;
                break;
            }

            default:
                throw new Error(`Unknown msg '${msg}'.`);
        }

        console.log("setting model");
        localStorage.setItem("model", JSON.stringify(this.model));
    }

    render(component) {
        while (this.node.firstElementChild) {
            this.node.firstElementChild.remove();
        }
        this.node.appendChild(component.call(this, this.model, this.update));
    }

    async scrollFeed() {
        if (window.location.hash === "#/s/all") {
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

    async monitorFeed() {
        // Request permission to show notifications if needed
        if (Notification.permission === "default") {
            await Notification.requestPermission();
        }

        // If the user denied permission to show notifications there is no point polling the feed
        if (Notification.permission === "denied") return;

        // Check the user is logged in
        if (this.model.currentUser) {
            const { posts } = await this.api.user.getFeed();
            // Check if there is an old version of the feed to compare to
            if (this.monitorFeed.snapshot) {
                for (const post of posts) {
                    // Check each post to see if it is in the snapshot from last time
                    const inSnapshot = this.monitorFeed.snapshot.find(({ id }) => id === post.id);
                    // Check that the post was created approximately within the last polling interval to avoid
                    // false-positives caused by deleting posts in multi-page feeds
                    const isRecent = (Date.now() - (post.meta.published * 1000)) <= (App.POLLING_INTERVAL * 1.75);
                    if (!inSnapshot && isRecent) {
                        // If the post wasn't in the snapshot it must be new so notify the user
                        const notification = new Notification(
                            `${post.meta.author} just posted`, {
                                body: "Click to view..."
                            }
                        );

                        notification.addEventListener("click", event => {
                            route.post(post.id);
                        });
                    }
                }
            }
            // Save the snapshot of the feed for the next time
            this.monitorFeed.snapshot = posts;
        }

        window.setTimeout(this.monitorFeed, App.POLLING_INTERVAL);
    }

}
