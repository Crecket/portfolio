import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.scss";

import siteConfig from "./Config/site";

import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";

class App extends Component {
    render() {
        return (
            <div className="app">
                <BrowserRouter basename={siteConfig.baseName} forceRefresh={false}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route component={NotFound} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
