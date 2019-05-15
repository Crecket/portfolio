import React from "react";
import { hydrate, render } from "react-dom";
import { loadComponents, getState } from "loadable-components";

import App from "./App";
import * as serviceWorker from "./ServiceWorker/serviceWorker";

// store the loadable state so it can be used with the pre-rendered html
window.snapSaveState = () => getState();

const application = <App />;
const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
    // wait for loadable to finish loading external scripts
    loadComponents().then(() => {
        hydrate(application, rootElement);

        if (process.env.NODE_ENV === "development") {
            serviceWorker.unregister();
        } else {
            serviceWorker.register();
        }
    });
} else {
    render(application, rootElement);
}
