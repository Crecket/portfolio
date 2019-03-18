const path = require("path");

module.exports = {
    staticFileGlobs: ["build/static/css/**.css", "build/static/js/**.js", "build/*.ico"],
    swFilePath: "./build/service-worker.js",
    stripPrefix: "build/",
    navigateFallback: "/200.html",
    navigateFallbackWhitelist: [/https\:\/\/[^/]+($|\/(?!api)\/?.*$)/],
    minify: true,
    dynamicUrlToDependencies: {
        "/": [path.join(__dirname, "/../../build/index.html")],
        "/bunq": [path.join(__dirname, "/../../build/bunq/index.html")],
        "/404": [path.join(__dirname, "/../../build/404/index.html")]
    },
    runtimeCaching: [
        {
            urlPattern: /^https\:\/\/ajax\.googleapis\.com\/ajax\/libs\/webfont.*/,
            handler: "cacheFirst"
        },
        {
            urlPattern: /\/api.*/,
            handler: "networkFirst"
        },
        {
            urlPattern: /.*(png|jpg|ico|woff|woff2)/,
            handler: "cacheFirst"
        },
        {
            urlPattern: /^https?.*/,
            handler: "networkFirst"
        }
    ]
};
