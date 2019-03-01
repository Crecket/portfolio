import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";

import siteConfig from "./Config/site";

import Routes from "./Routes";

const App = () => {
    return (
        <div className="app">
            <BrowserRouter basename={siteConfig.baseName} forceRefresh={false}>
                <Routes />
            </BrowserRouter>
        </div>
    );
};

export default App;
