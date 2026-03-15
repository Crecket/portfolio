import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";

import NotFound from "./Pages/NotFound/NotFound";
import routes from "./Config/routes";

interface RouteComponent {
    path: string;
    exact?: boolean;
    render: (props: any) => any;
}

// map config to Page components
const RouteComponents = Object.keys(routes).map(routeName => {
    const routeDetails = routes[routeName];
    const routePath = routeDetails.path;

    const Component = lazy(() => import(`./Pages/${routeName}/${routeName}`));

    const routeProps: RouteComponent = {
        path: routePath,
        render: renderProps => <Component {...renderProps} />
    };
    if (routePath === "/") routeProps.exact = true;

    return <Route key={routePath} {...routeProps} />;
});

const Routes = () => {
    return (
        <main>
            <Suspense fallback={<div />}>
                <Switch>
                    {RouteComponents}
                    <Route path="*" element={<NotFound />} />
                </Switch>
            </Suspense>
        </main>
    );
};

export default Routes;
