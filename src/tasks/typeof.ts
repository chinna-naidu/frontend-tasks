

export const typeOf = <T>(value: T): string => {
    // calling the default implementation of toString on Object 
    // to get the type
    const typeString = Object.prototype.toString.call(value);


    // remvoing starting and ending []
    // the splitting and return the last value
    const type = typeString.slice(1, -1).split(" ").at(-1)?.toLowerCase();

    return type as string;
}