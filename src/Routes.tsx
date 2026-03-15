import React, { Suspense, lazy } from "react";
import { Route, Switch, useLocation } from "react-router-dom";

import NotFound from "./Pages/NotFound/NotFound";
import routes from "./Config/routes";

interface RouteComponent {
    key: string;
    path: string;
    exact?: boolean;
    render: (props: any) => any;
}

// map config to Page components
const RouteComponents = Object.keys(routes).map(routeName => {
    const routeDetails = routes[routeName];
    const routePath = routeDetails.path;

    const Component = lazy(() => import(`./Pages/${routeName}/${routeName}`));

    const props: RouteComponent = {
        key: routePath,
        path: routePath,
        render: renderProps => <Component {...renderProps} />
    };
    if (routePath === "/") props.exact = true;

    return <Route {...props} />;
});

const Routes = () => {
    const location = useLocation();
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
