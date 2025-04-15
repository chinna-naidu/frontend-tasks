export const get = <T extends Record<string, any>, V>(obj: T, path: string[] | string, defaultValue: V): V => {
    // if input object is null or undefined or not an object then return default value
    if (typeof obj !== 'object' || obj === null || obj === undefined) {
        return defaultValue;
    }

    // formatting path to make accessbility easy 
    // and converting to an array if it's not already one
    if (!Array.isArray(path)) {
        path = path.replace("[", ".")
            .replace("]", "")
            .split(".");
    }

    // getting the path at the first index of the array
    const currPath = path[0];

    // recursion base case if path is the last one in the array
    if (path.length === 1) {
        return obj.hasOwnProperty(currPath) && obj[currPath] !== null ? obj[currPath] : defaultValue;
    }

    // if the current path exists and is an object, continue the recursion
    if (obj.hasOwnProperty(currPath) && typeof obj[currPath] === 'object') {
        return get(obj[currPath], path.slice(1), defaultValue);
    }

    // if all cases fail return default value
    return defaultValue;
};
