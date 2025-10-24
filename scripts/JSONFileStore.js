import JSONStore from "json-store";

export default (fileLocation) => {
    const store = JSONStore(fileLocation);
    return {
        get: (key) => store.get(key),
        set: (key, value) => store.set(key, value),
        remove: (key) => store.set(key, null)
    };
};
