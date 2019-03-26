const path = require("path");

module.exports = {
    staticFileGlobs: ["build/*.ico"],
    swFilePath: "./build/service-worker.js",
    stripPrefix: "build/",
    navigateFallback: "/200.html",
    navigateFallbackWhitelist: [/https\:\/\/[^/]+($|\/(?!api)\/?.*$)/],
    minify: true,
    dynamicUrlToDependencies: {
        "/": [path.join(__dirname, "/../../build/index.html")],
        "/projects": [path.join(__dirname, "/../../build/projects/index.html")],
        "/bunq": [path.join(__dirname, "/../../build/bunq/index.html")],
        "/notfound": [path.join(__dirname, "/../../build/notfound/index.html")]
    },
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
