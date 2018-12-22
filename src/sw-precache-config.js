const path = require("path");

module.exports = {
    staticFileGlobs: ["build/static/css/**.css", "build/static/js/**.js"],
    swFilePath: "./build/service-worker.js",
    stripPrefix: "build/",
    handleFetch: false,
    navigateFallback: "/index.html",
    minify: true,
    dynamicUrlToDependencies: {
        "/": [path.resolve(__dirname, "/../build/index.html")],
        "/404": [path.resolve(__dirname, "/../build/404/index.html")]
    },
    navigateFallback: "/404",
    runtimeCaching: [
        {
            urlPattern: /\//,
            handler: "networkFirst"
        },
        {
            urlPattern: /\/api\//,
            handler: "networkFirst"
        }
    ]
};
