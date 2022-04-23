const glob = require("glob");

module.exports = () => {
    const buildFiles = glob.sync("build/**/index.html");

    const staticList = [];
    buildFiles.forEach(indexFile => {
        // remove 'build' start and '/index.html' from end
        const publicLocation = indexFile.replace(/^build/, "");
        const url = publicLocation.replace("/index.html", "");

        if (!url) return;

        staticList.push({
            url: url,
            publicLocation: publicLocation
        });
    });

    return staticList;
};
