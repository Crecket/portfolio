const fastifyPlugin = require("fastify-plugin");
const sitemap = require("sitemap");

const routes = require("../src/Config/routes");
const customSettings = {
    Home: { priority: 1 },
    Contact: { priority: 0.7 },
    Projects: { priority: 0.7 },
    Bunq: { changefreq: "weekly", priority: 0.5 }
};

const sitemapPlugin = (fastify, options, next) => {
    // map url config to a useable sitemap config
    const urls = [];
    Object.keys(routes)
        .filter(routeName => {
            const routeDetails = routes[routeName];

            return routeDetails.ignoreSitemap !== true;
        })
        .forEach(routeName => {
            const routeDetails = routes[routeName];
            const extraSettings = customSettings[routeName] || {};

            const sitemapUrl = routeDetails.cleanUrl || routeDetails.path;

            // add the main path to the list
            urls.push({ url: sitemapUrl, ...extraSettings });

            // check for subpaths
            if (Array.isArray(routeDetails.subPaths)) {
                routeDetails.subPaths.forEach(subPath => {
                    urls.push({ url: `${sitemapUrl}${subPath}`, priority: 0.2 });
                });
            }
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
