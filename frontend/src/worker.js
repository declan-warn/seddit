const model = {
    apiUrl: null,
    token: null,
    mostRecent: null,
};

const POLLING_INTERVAL = 2500;

this.addEventListener(
    "message",
    ({ data: [msg, payload = {}] }) => {
        switch (msg) {
            case "SET_API_URL":
                model.apiUrl = payload;
                break;

            case "UPDATE_TOKEN":
                model.token = payload;
                // if (model.apiUrl && token !== null) {
                //     model.api = new APIWrapper(model, model.apiUrl);
                // } else {
                //     model.api = null; 
                // }
                break;

            default:
                throw new Error(`Unknown msg '${msg}'.`);
        }
    }
);

(async function () {
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    } else if (Notification.permission === "denied") {
        alert("Notifications blocked. Please enable them.");
    }

    setInterval(async () => {
        if (model.apiUrl === null || model.token === null) return;

        const response = await fetch(`http://${model.apiUrl}/user/feed`, {
            headers: {
                Authorization: `Token ${model.token}`,
            }
        });

        const { posts } = await response.json();

        console.log(`${posts[0].meta.published} <=> ${model.mostRecent}`)

        if (model.mostRecent !== null) {
            console.log("??")
            const x = posts
                .filter(({ meta }) => meta.published > model.mostRecent)

            console.log(x);
            
            x
                .forEach(post => new Notification(post.title, {
                    body: post.text,
                }));
        }
        model.mostRecent = posts[0].meta.published;

        ///console.log("DATA:", JSON.stringify(posts));
        
    }, POLLING_INTERVAL);
})();