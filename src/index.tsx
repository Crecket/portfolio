import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found. Ensure index.html has a <div id='root'> element.");
}
const root = createRoot(rootElement);
root.render(<App />);
