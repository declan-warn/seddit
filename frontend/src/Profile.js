import { withHeader } from "./AppHeader.js";

export default (model, update) => {
    const profile = document.createElement("div");

    const info = document.createElement("main");

    fetch(`http://${model.apiUrl}/user?id=${model.userId}`, {
        headers: {
            "Authorization": `Token ${model.token}`
        }
    })
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

    profile.append(info);
    
    return withHeader(model, update, profile);
};