import { createElement } from "/src/util.js";
import { withHeader } from "/src/component/AppHeader.js";

export default function () {
    return withHeader(this, createElement(
        "main", {
            class: "loading",
            children: [
                ["div", {
                    class: "modal",
                    children: [  
                        ["img", {
                            src: "/images/spinner.png"
                        }]
                    ]
                }]
            ]
        }
    ));
}
