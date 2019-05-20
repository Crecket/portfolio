import React from "react";
import loadable from "loadable-components";
import { Switch, Route } from "react-router-dom";

import NotFound from "./Pages/NotFound/NotFound";

const routes = require("./Config/routes");

// map config to Page components
const RouteComponents = Object.keys(routes).map(routePattern => {
    const routeName = routes[routePattern];

    // wrap component in a lazy load element
    const Component = loadable(() => import(`./Pages/${routeName}/${routeName}.jsx`), {
        // dumb hack to ensure that loadable realizes there is content without showing the "Loading" text
        LoadingComponent: () => <div>.</div>
    });

    const props = {
        key: routePattern,
        path: routePattern,
        render: props => <Component {...props} />
    };
    if (routePattern === "/") props.exact = true;

    // return the Route component
    return <Route {...props} />;
});

const Routes = () => {
    return (
        <main>
            <Switch>
                {RouteComponents}

                <Route component={NotFound} />
            </Switch>
        </main>
    );
};

export default Routes;
