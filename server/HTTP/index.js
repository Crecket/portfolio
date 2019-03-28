import glob from "glob";

const buildFiles = glob.sync("build/**/index.html");
const blackListedRoutes = ["/", "/notfound"];

export default (app, opts, next) => {
    buildFiles.forEach(indexFile => {
        // remove 'build' start and '/index.html' from end
        const publicLocation = indexFile.replace(/^build/, "");
        const fixedUrl = publicLocation.replace("/index.html", "");

        // skip index file and blacklisted routes
        if (!fixedUrl || blackListedRoutes.includes(fixedUrl)) return;

        // register an actual route so the inital response isn't 404
        app.get(fixedUrl, (request, reply) => reply.sendFile(publicLocation));
    });

    app.setNotFoundHandler((request, reply) => {
        const isApi = request.raw.originalUrl.indexOf("/api") === 0;

        if (isApi) {
            reply.code(404).send({ error: "Page not found" });
        } else {
            reply.code(404).sendFile("notfound/index.html");
        }
    });

    next();
};
