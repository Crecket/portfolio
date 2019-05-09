const path = require("path");
const StaticRouteLoader = require("../../server/HTTP/StaticRouteLoader");

const publicAbsolutePath = path.join(__dirname, "..", "..", "build");

const dynamicUrlToDependencyList = {
    "/": `${publicAbsolutePath}/index.html`
};
StaticRouteLoader().forEach(staticRoute => {
    dynamicUrlToDependencyList[staticRoute.url] = [
        path.normalize(`${publicAbsolutePath}${staticRoute.publicLocation}`)
    ];
});

module.exports = {
    staticFileGlobs: ["build/*.ico", "build/static/**/*.css"],
    swFilePath: "./build/service-worker.js",
    stripPrefix: "build/",
    navigateFallback: "/200.html",
    navigateFallbackWhitelist: [/https\:\/\/[^/]+($|\/(?!api)\/?.*$)/],
    minify: true,
    dynamicUrlToDependencies: dynamicUrlToDependencyList,
    runtimeCaching: [
        {
            urlPattern: /.*(json)/,
            handler: "networkFirst"
        },
        {
            urlPattern: /^https\:\/\/ajax\.googleapis\.com\/ajax\/libs\/webfont.*/,
            handler: "cacheFirst"
        },
        {
            urlPattern: /\/api.*/,
            handler: "networkFirst"
        },
        {
            urlPattern: /.*(js|css|png|jpg|ico|woff|woff2)/,
            handler: "cacheFirst"
        }
    ]
};
