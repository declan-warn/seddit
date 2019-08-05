const model = {
    apiUrl: null,
    token: null,
    api: null,
};

this.addEventListener(
    "message",
    ({ data: [msg, payload = {}] }) => {
        switch (msg) {
            case "SET_API_URL":
                model.apiUrl = payload;
                break;

            case "UPDATE_TOKEN":
                token = payload;
                if (model.apiUrl && token !== null) {
                    model.api = new APIWrapper(model, model.apiUrl);
                } else {
                    model.api = null; 
                }
                
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
        const api = model.api;
        if (api === null) return;
        console.log(await api.user.getFeed());
    }, 2000);

})();