import glob from "glob";

export default directory => {
    const files = glob.sync(`${directory}/*.json`);

    return files.map(file => require(file));
};
