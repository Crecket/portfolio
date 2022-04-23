import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { loadComponents, getState } from "loadable-components";

import App from "./App";
import * as serviceWorker from "./ServiceWorker/serviceWorker";

// @ts-ignore store the loadable state so it can be used with the pre-rendered html
if (window) window.snapSaveState = () => getState();

const application = <App />;
const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
    // wait for loadable to finish loading external scripts
    loadComponents().then(() => {
        hydrateRoot(rootElement, application);

        if (process.env.NODE_ENV === "development") {
            serviceWorker.unregister();
        } else {
            serviceWorker.register();
        }
    });
} else {
    const root = createRoot(rootElement);
    root.render(application);

    // if (process.env.NODE_ENV === "development" && module.hot) {
    //     module.hot.accept("./App", () => {
    //         const NextApp = require("./App").default;
    //         render(<NextApp />, rootElement);
    //     });
    // }
}
