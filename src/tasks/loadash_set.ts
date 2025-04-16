

const NUM_RGEX = /\d+/i

export const set = (obj: any, path: string[] | string, value: any): void => {
    // if input object is null or undefined or not an object then return default value
    if (typeof obj !== 'object' || obj === null || obj === undefined) {
        return;
    }

    const keys = !Array.isArray(path)
        ? path.replace("[", ".").replace("]", "").split(".")
        : path;


    const currKey = NUM_RGEX.test(keys[0]) ? Number(keys[0]) : keys[0];

    // recursion base case
    if (keys.length === 1) {
        obj[currKey] = value;
        return;
    }

    // if the object does not contain the property
    if (!Object.prototype.hasOwnProperty.call(obj, currKey)) {
        const nextPath = keys[1];

        // checking if the next path is number path
        const isNumberPath = NUM_RGEX.test(nextPath);

        // if number path then assigning an array as value else object
        obj[currKey] = isNumberPath ? [] : {};
    }


    // setting the nested path for value for the next keys list
    set(obj[currKey], keys.slice(1), value);
}