import { withHeader } from "/src/component/AppHeader.js";

import { createElement } from "/src/util.js";

export default (model, update) => {
    const info = createElement("main", {
        children: [
            ["h2", {
                children: model.routeData.username     
            }]
        ]
    });
    
    return withHeader(model, update, info);
};