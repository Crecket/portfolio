const isDevelopment = process.env.NODE_ENV === "development";

/**
 * @param configContents
 * @param overwriteDevWithProd If true, development will be imported and then overwritten
 *                             with the production config. If false, the production config
 *                             will be returend directly.
 * @returns {*}
 * @constructor
 */
const ConfigParser = (configContents, overwriteDevWithProd = true) => {
    if (isDevelopment) return configContents.development;

    if (overwriteDevWithProd && configContents.development && configContents.production) {
        return { ...configContents.development, ...configContents.production };
    }

    return configContents.production;
};

export default ConfigParser;
