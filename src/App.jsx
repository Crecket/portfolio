import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.scss";
import "typeface-roboto";

import siteConfig from "./Config/site";

import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";

const App = () => {
    return (
        <div className="app">
            <BrowserRouter basename={siteConfig.baseName} forceRefresh={false}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/404" component={NotFound} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
