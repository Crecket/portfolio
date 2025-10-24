import * as path from "path";
import glob from "glob";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ignoredFiles = [path.normalize(`${__dirname}${path.sep}together.json`)];

export default async (directory: string) => {
    const files = glob.sync(`${directory}/greg.json`);

    const dataSets = [];
    for (const file of files) {
        if (!ignoredFiles.includes(file)) {
            const { default: data } = await import(file, { assert: { type: "json" } });
            dataSets.push(data);
        }
    }
    return dataSets;
};
