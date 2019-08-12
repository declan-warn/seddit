import { withHeader } from "/src/component/AppHeader.js";
import FeedItem from "/src/component/FeedItem.js";
import { createElement } from "/src/util.js";

export default function() {
    return withHeader(this, createElement(
        "main", {
            children: [
                ["ul", {
                    id: "feed",
                    children: this.model.routeData.map(post =>
                        FeedItem(this.model, this.update, post)
                    )
                }]
            ]
        }
    ));
}
