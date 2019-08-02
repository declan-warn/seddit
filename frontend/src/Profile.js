import { withHeader } from "/src/component/AppHeader.js";

import { createElement } from "/src/util.js";

export default (model, update) => {
    const username = model.routeData.username;
    const info = createElement("main", {
        class: "profile",
        children: [
            ["section", {
                "data-id-profile-info": "",
                class: "info",
                children: [
                    ["div", {
                        "data-id-profile-picture": "",
                    }],
                    ["div", {
                        children: [
                            ["h2", {
                                "data-id-profile-username": "",
                                children: username
                            }],
                            ["span", {
                                "data-id-profile-email": "",
                                children: model.routeData.email
                            }],
                            ["button", {
                                "data-id-profile-follow": "",
                                onClick() { update("FOLLOW_USER", { username }) },
                                children: "Follow"
                            }]
                        ]
                    }]
                ]
            }]
        ]
    });

    return withHeader(model, update, info);
};