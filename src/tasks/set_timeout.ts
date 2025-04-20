interface SetTimeoutProps {
    mySetTimeout: (fn: () => void, ms: number) => number;
    myClearTimeout: (id: number) => void;
}

export const createSetTimeout = (): SetTimeoutProps => {
    let timerId = 0;

    const timerSet = new Set<number>();

    const mySetTimeout = (fn: () => void, ms: number): number => {
        const id = createTimerId();

        const startTime = Date.now();

        const check = () => {
            // check if timer is cancelled before completion
            if (!timerSet.has(id)) {
                return;
            }

            // if delay is exceeded run the callback function and return
            if (Date.now() - startTime >= ms) {
                fn();
                return;
            }
            queueMicrotask(() => check());
        };

        // initiating the intial check aynchronously as timeouts are async
        queueMicrotask(() => check());

        return id;
    };

    const myClearTimeout = (id: number) => {
        timerSet.delete(id);
    };

    const createTimerId = () => {
        const id = ++timerId;

        timerSet.add(id);

        return id;
    };

    return { mySetTimeout, myClearTimeout };
};
