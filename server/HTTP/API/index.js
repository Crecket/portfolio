import * as childProcess from "child_process";
import * as path from "path";

const updateScript = path.join(__dirname, "..", "..", "..", "scripts", "check-updates.sh");
const exec = childProcess.exec;

export default (app, opts, next) => {
    app.get("/", async (request, reply) => {
        reply.send({ status: "OK" });
    });

    app.get("/update", (request, reply) => {
        if (!request.query || !request.query.key || request.query.key !== process.env.UPDATE_SERVER_KEY) {
            return reply.code(403).send({ error: "Access denied" });
        }

        exec(`bash ${updateScript}`, (error, stdout, stderr) => {
            if (error !== null) {
                reply.send({ error: error, stderr: stderr });
            } else {
                reply.send(stdout);
            }
        });
    });

    next();
};
