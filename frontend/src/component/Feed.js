import { withHeader } from "/src/component/AppHeader.js";
import FeedItem from "/src/component/FeedItem.js";
import { createElement } from "/src/util.js";

export default (model, update) => withHeader(model, update, createElement(
    "div", {
        children: [
            ["ul", {
                id: "feed",
                children: model.routeData.map(post =>
                    FeedItem(model, update, post)
                )
            }]
        ]
    }
));