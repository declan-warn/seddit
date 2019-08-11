// Utilities
import APIWrapper from "/src/api.js";
import * as util from "/src/util.js";
import * as route from "/src/route.js";

// Components
import Feed from "/src/component/Feed.js";
import FeedItem from "/src/component/FeedItem.js";
import LoginForm from "/src/component/LoginForm.js";
import Post from "/src/component/Post.js";
import Profile from "/src/component/Profile.js";
import ProfileForm from "/src/component/ProfileForm.js";
import SignupForm from "/src/component/SignupForm.js";
import SubmitForm from "/src/component/SubmitForm.js";

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
        this.handleRouting = this.handleRouting.bind(this);
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
                route.front();
                break;
            }

            case "COMMENT_SUBMIT": {
                await this.api.post.comment(payload.id, payload.body);
                route.post(payload.id);
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

    async handleRouting(event) {
        console.log(event);

        const [routeName, ...args] =
            window.location.hash
                .split("/")
                .slice(1);

        //console.log("ROUTE:", route, args);

        switch (routeName) {
            case "login":
                this.render(LoginForm);
                break;

            case "signup":
                this.render(SignupForm);
                break;

            case "feed": {
                route.feed();
                break;
            }

            case "profile":
                if (!args[0]) {
                    route.profile(this.model.currentUser.username);
                    return;
                }

                if (args[1] === "edit") {
                    this.update("UPDATE_ROUTE_DATA", await this.api.user.get());
                    this.render(ProfileForm);
                } else {
                    //await this.update("REFRESH_CURRENT_USER");
                    const userData = await this.api.user.get(args[0]);
                    const posts = await Promise.all(
                        userData.posts.map(this.api.post.get)
                    );

                    this.update("UPDATE_ROUTE_DATA", { ...userData, posts });
                    this.render(Profile);
                }

                break;

            case "submit":
                await this.update("UPDATE_ROUTE_DATA");
                this.render(SubmitForm);
                break;

            case "post": {
                const post = await this.api.post.get(Number(args[0]));
                this.update("UPDATE_ROUTE_DATA", post);
                this.render(
                    args[1] === "edit"
                        ? SubmitForm
                        : Post
                );
                break;
            }

            case "s":
                const subseddit = args[0];
                if (subseddit === "all") {
                    const { posts } = await this.api.user.getFeed();
                    posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));

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
                            .forEach(post => routeData.push(post));
                    }
    
                    this.update("UPDATE_ROUTE_DATA", routeData);
                    this.render(Feed);
                }
                break;

            case "search": {
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
                        .forEach(post => routeData.push(post));
                }
                
                this.update("UPDATE_ROUTE_DATA", routeData);
                this.render(Feed);

                break;
            }

            case "signout":
                this.update("SIGNOUT");
                break;

            case "front":
            default: {
                const { posts } = await this.api.post.getPublic();
                posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));

                this.update("UPDATE_ROUTE_DATA", posts);
                this.render(Feed);
                
                break;
            }
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
                        const notification = new Notification(`"New post from ${post.meta.author}`, {
                            body: `${post.title.substr(0, 17)}...`
                        });

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
