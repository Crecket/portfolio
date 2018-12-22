import ConfigParser from "./ConfigParser";

const site = {
    development: {
        baseName: "/"
    },
    production: {
        baseName: "/"
    }
};

export default ConfigParser(site);
