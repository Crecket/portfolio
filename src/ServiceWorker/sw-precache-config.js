const path = require("path");

module.exports = {
    staticFileGlobs: [
        "build/static/css/**.css",
        "build/static/js/**.js",
        "build/*@(png|jpg|ico|gif)"
    ],
    swFilePath: "./build/service-worker.js",
    stripPrefix: "build/",
    navigateFallback: "/200.html",
    minify: true,
    dynamicUrlToDependencies: {
        "/": [path.join(__dirname, "/../../build/index.html")],
        "/404": [path.join(__dirname, "/../../build/404/index.html")]
    },
    runtimeCaching: [
        {
            urlPattern: /\/api\//,
            handler: "networkFirst"
        },
        {
            urlPattern: /^https\:\/\/fonts\.gstatic\.com\/.*/,
            handler: "cacheFirst"
        },
        {
            urlPattern: /^https\:\/\/fonts\.googleapis\.com\/css.*/,
            handler: "cacheFirst"
        },
        {
            urlPattern: /^https\:\/\/fonts\.googleapis\.com\/css.*/,
            handler: "cacheFirst"
        },
        // {
        //     urlPattern: /^https?.*/,
        //     handler: "cacheFirst"
        // }
    ]
};
