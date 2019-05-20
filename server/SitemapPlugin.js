const fastifyPlugin = require("fastify-plugin");
const sitemap = require("sitemap");

const routes = require("../src/Config/routes");
const customSettings = {
    Home: { priority: 0.7 },
    Bunq: { changefreq: "daily", priority: 0.5 }
};

const sitemapPlugin = (fastify, options, next) => {
    // map url config to a useable sitemap config
    const urls = Object.keys(routes)
        .filter(routeName => {
            const routeDetails = routes[routeName];

            return routeDetails.ignoreSitemap !== true;
        })
        .map(routeName => {
            const routeDetails = routes[routeName];
            const extraSettings = customSettings[routeName] || {};

            const sitemapUrl = routeDetails.cleanUrl || routeDetails.path;

            return { url: sitemapUrl, ...extraSettings };
        });

    // create sitemap instance
    const sitemapInstance = sitemap.createSitemap({
        hostname: "https://gregoryg.dev/",
        cacheTime: 600000,
        urls: urls
    });

    // preload xml data
    sitemapInstance.toXML((error, xml) => {
        // setup a route to serve the sitemap
        fastify.get("/sitemap.xml", (request, reply) => {
            reply
                .code(200)
                .header("Content-Type", "application/xml")
                .send(xml);
        });

        // continue
        next();
    });
};

export default fastifyPlugin(sitemapPlugin);
