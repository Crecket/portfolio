import ConfigParser from "./ConfigParser";

const site = {
    development: {
        baseName: "localhost:3000/"
    },
    production: {
        baseName: "localhost/"
    }
};

export default ConfigParser(site);
