import React from "react";
import Loadable from "react-loadable";
import { Switch, Route } from "react-router-dom";

import NotFound from "./Pages/NotFound/NotFound";

const routes = require("./Config/routes");

const LoadingComponent = ({ error, pastDelay, retry, timedOut }) => {
    if (error) {
        return (
            <div>
                Error! <button onClick={retry}>Retry</button>
            </div>
        );
    } else if (timedOut) {
        return (
            <div>
                Taking a long time... <button onClick={retry}>Retry</button>
            </div>
        );
    } else if (pastDelay) {
        return <div>Loading...</div>;
    } else {
        return null;
    }
};

// map config to Page components
const RouteComponents = Object.keys(routes).map(routePattern => {
    const routeName = routes[routePattern];

    // wrap component in a lazy load element
    const Component = Loadable({
        loader: () => import(`./Pages/${routeName}/${routeName}.jsx`),
        loading: LoadingComponent,
        pastDelay: 500,
        timeout: 2000
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
        <Switch>
            {RouteComponents}

            <Route component={NotFound} />
        </Switch>
    );
};

export default Routes;
