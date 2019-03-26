import * as path from "path";
import ClientRoutes from "../../src/Config/routes";

export default (app, opts, next) => {
    app.get("/", async (request, reply) => reply.sendFile("index.html"));

    Object.keys(ClientRoutes)
        .filter(url => {
            switch (url) {
                case "/":
                    return false;
            }
            return true;
        })
        .forEach(url => {
            const fileName = ClientRoutes[url].toLocaleLowerCase();
            const filePath = url === "/" ? `${fileName}.html` : `${fileName}${path.sep}index.html`;

            app.get(url, async (request, reply) => reply.sendFile(filePath));
        });

    next();
};
