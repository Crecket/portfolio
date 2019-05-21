import backgroundPlugin from "./Plugins/background";

const plugins = [backgroundPlugin];

export default (customPlugins = []) => {
    return [...plugins, ...customPlugins];
};
