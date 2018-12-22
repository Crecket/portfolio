const fs = require("fs");
const util = require("util");
const glob = util.promisify(require("glob"));
const path = require("path");
const chalk = require("chalk");

const cachedFiles = {};

class SpdyHelper {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.isSpdy = Boolean(this.req.isSpdy);

        this.pushPromises = [];
    }

    addGlob(globPattern, contentType = "application/javascript") {
        this.pushPromises.push(
            new Promise(resolve => {
                const globPatternResolved = path.resolve(__dirname, "..", "..", "build", globPattern);

                glob(globPatternResolved)
                    .then(files => {
                        // go through each file and attempt to push
                        files.forEach(file => this.add(file, contentType));
                        resolve();
                    })
                    .catch(error => {
                        console.error(chalk.red("Failed to glob files!"));
                        console.error(error);
                        resolve();
                    });
            })
        );
    }

    add(fileLocation, contentType = "application/javascript", options = {}, responseOptionsInput = {}) {
        if (!this.isSpdy) return Promise.resolve();

        const publicFileLocation = path.resolve(__dirname, "..", "..", "build", fileLocation);

        const responseOptions = {
            status: 200,
            method: "GET",
            request: {
                accept: "*/*"
            },
            response: {
                "content-type": contentType
            },
            ...responseOptionsInput
        };

        this.pushPromises.push(
            new Promise(resolve => {
                console.log("Attempting to push stream", publicFileLocation);

                // push the file and retrieve the stream
                const stream = this.res.push(fileLocation, responseOptions);
                stream.on("error", error => {
                    console.error(chalk.red("Stream failure!"));
                    console.error(error);
                    resolve();
                });

                if (cachedFiles[publicFileLocation]) {
                    stream.end(cachedFiles[publicFileLocation]);
                    resolve();
                } else {
                    fs.readFile(publicFileLocation, (error, fileContent) => {
                        if (error) {
                            console.error(chalk.red("Failed to get file contents!"));
                            console.error(error);
                            resolve();
                            return;
                        }

                        // store the file content
                        cachedFiles[publicFileLocation] = fileContent;

                        stream.end(fileContent);
                        resolve();
                    });
                }
            })
        );
    }

    finish() {
        return Promise.all(this.pushPromises);
    }
}

module.exports = SpdyHelper;
