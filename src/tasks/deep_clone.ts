


export const deepClone = <T>(obj: T): T => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // if type is not object
    if (typeof obj !== 'object') {
        return obj;
    }

    // check if obj is array or not for result type
    const result = (Array.isArray(obj) ? [] : {});

    // for arrays key will be idx
    // for objects key will be keys
    for (const key in obj) {
        //@ts-ignore
        result[key] = deepClone(obj[key])
    }

    // copy symbols also
    const symbolKeys = Object.getOwnPropertySymbols(obj);

    for (const key of symbolKeys) {
        //@ts-ignore
        result[key] = deepClone(obj[key]);
    }

    return result as T;
}
