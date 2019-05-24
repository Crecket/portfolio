const path = require("path");
const StaticRouteLoader = require("../../server/HTTP/StaticRouteLoader");

const publicAbsolutePath = path.join(__dirname, "..", "..", "build");

const dynamicUrlToDependencyList = {
    "/": [`${publicAbsolutePath}/index.html`]
};

const staticRoutes = StaticRouteLoader();
staticRoutes.forEach(staticRoute => {
    dynamicUrlToDependencyList[staticRoute.url] = [
        path.normalize(`${publicAbsolutePath}${staticRoute.publicLocation}`)
    ];
});

module.exports = {
    minify: true,
    stripPrefix: "build/",
    navigateFallback: "/200.html",
    staticFileGlobs: ["build/static/**/*.+(js|css|svg|png)", "build/*.ico"],
    swFilePath: "./build/service-worker.js",
    navigateFallbackWhitelist: [/https\:\/\/[^/]+($|\/(?!api)\/?.*$)/],
    dynamicUrlToDependencies: dynamicUrlToDependencyList,
    runtimeCaching: [
        {
            urlPattern: /\/api.*/,
            handler: "networkFirst"
        },
        {
            urlPattern: /\/bunq-charts\/.*(png|jpg)/,
            handler: "networkOnly"
        },
        {
            urlPattern: /.*(json)/,
            handler: "networkFirst"
        },
        {
            urlPattern: /^https\:\/\/ajax\.googleapis\.com\/ajax\/libs\/webfont.*/,
            handler: "cacheFirst"
        },
        {
            urlPattern: /.*(js|css|png|jpg|svg|ico|woff|woff2)/,
            handler: "cacheFirst"
        }
    ]
};
