import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";

const routes = require("./Config/routes");

// map config to Page components
const RouteComponents = Object.keys(routes).map(routePattern => {
    const routeName = routes[routePattern];

    // wrap component in a lazy load element
    const Component = lazy(() => import(`./Pages/${routeName}/${routeName}.jsx`));

    // return the Route component
    return <Route key={routePattern} path={routePattern} component={Component} />;
});

const Routes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/" component={Home} />

                {RouteComponents}

                <Route component={NotFound} />
            </Switch>
        </Suspense>
    );
};

export default Routes;
