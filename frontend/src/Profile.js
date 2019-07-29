import AppHeader from "./AppHeader.js";

export default (model, update) => {
    const profile = document.createElement("div");

    const header = AppHeader(model, update);

    const info = document.createElement("main");

    fetch(`http://${model.apiUrl}/dummy/user`)
        .then(x => x.json())
        .then(({ username, posts }) => {
            const lines = [
                `Username: ${username}`,
                `${posts.length} posts`,
            ];
            
            lines.forEach(line => {
                const p = document.createElement("p");
                p.textContent = line;
                info.append(p);
            });
        });

    profile.append(header, info);
    
    return profile;
};