import chalk from "chalk";
const fastify = require("fastify");

export default (httpPort) => {
    if(!httpPort) return;

    const httpApp = fastify({});

    httpApp.get("/*", (request, reply) => {
        reply.redirect(`https://${process.env.SERVER_HOSTNAME}${request.raw.originalUrl}`);
    });

    httpApp.listen(httpPort, process.env.SERVER_HOSTNAME, (err, address) => {
        if (err) throw err;
        console.log(`HTTP running at ${chalk.green(httpPort)} - ${chalk.yellow(address)}`);
    });
};
