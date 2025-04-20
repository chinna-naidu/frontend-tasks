

type CallbackFn<T, R> = (fn: (err?: Error | null, result?: R | null) => void, data: T) => void

export const promisify = <T, R>(fn: CallbackFn<T, R>) => {
    return (data: T) => {
        return new Promise<R>((resolve, reject) => {
            fn((err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve(result as R);
            }, data)
        })
    }
}