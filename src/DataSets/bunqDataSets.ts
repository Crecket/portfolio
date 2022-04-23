import * as path from "path";
import glob from "glob";

const ignoredFiles = [path.normalize(`${__dirname}${path.sep}together.json`)];

export default directory => {
    const files = glob.sync(`${directory}/greg.json`);

    return files
        .filter(file => {
            return !ignoredFiles.includes(file);
        })
        .map(file => require(file));
};
