import React from "react";
import { hydrate, render } from "react-dom";

import App from "./App";
import * as serviceWorker from "./ServiceWorker/serviceWorker";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);

    if (process.env.NODE_ENV === "development") {
        serviceWorker.unregister();
    } else {
        serviceWorker.register();
    }
} else {
    render(<App />, rootElement);
}
