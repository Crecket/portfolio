import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";

import routes from "./Config/routes";

const pageComponents: Record<string, React.LazyExoticComponent<any>> = {
    Home: lazy(() => import("./Pages/Home/Home")),
    Projects: lazy(() => import("./Pages/Projects/Projects")),
    Bunq: lazy(() => import("./Pages/Bunq/Bunq")),
    NotFound: lazy(() => import("./Pages/NotFound/NotFound"))
};

interface RouteComponent {
    path: string;
    exact?: boolean;
    render: (props: any) => any;
}

// map config to Page components
const RouteComponents = Object.keys(routes).map(routeName => {
    const routeDetails = routes[routeName];
    const routePath = routeDetails.path;
    const Component = pageComponents[routeName];

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
                    <Route path="*" render={renderProps => <pageComponents.NotFound {...renderProps} />} />
                </Switch>
            </Suspense>
        </main>
    );
};

export default Routes;
