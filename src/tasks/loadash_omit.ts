

const NUM_RGEX = /\d+/i

export const omit = (obj: any, path: string | string[]) => {
    if (typeof obj !== 'object' || obj === null || obj === undefined) {
        return;
    }


    const keys = !Array.isArray(path)
        ? path.replace("[", ".").replace("]", "").split(".")
        : path;

    const currKey = NUM_RGEX.test(keys[0]) ? Number(keys[0]) : keys[0];

    // recursion base case
    if (keys.length === 1) {
        // if current object is array then remove element at index
        if (Array.isArray(obj)) {
            obj.splice(currKey as number, 1);
        } else {
            delete obj[currKey];
        }
        return;
    }



    omit(obj[currKey], keys.slice(1));
} 