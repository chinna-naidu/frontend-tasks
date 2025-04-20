

interface SetIntevalProps {
    mySetInterval: (fn: () => void, ms: number) => number;
    myClearInterval: (id: number) => void;
}


export const createSetInterval = (): SetIntevalProps => {
    const timerSet = new Set<number>();

    let timerId = 0;

    const mySetInterval = (fn: () => void, ms: number): number => {
        const id = createTimerId();

        let lastRunTime = Date.now();

        const check = () => {
            // checking if interval is cleared by cleatInterval
            // then end the calling of check function
            if (!timerSet.has(id)) {
                return;
            }

            const elapsedTime = Date.now() - lastRunTime;

            if (elapsedTime >= ms) {
                fn();
                lastRunTime = Date.now();
            }
            // calling the recursive function asynchronously using queueMicrotask
            setImmediate(check);
        }

        // initiating the intial check aynchronously as timeouts are async
        setImmediate(check);

        return id;
    }


    const myClearInterval = (id: number) => {
        timerSet.delete(id);
    }

    const createTimerId = () => {
        const id = ++timerId;
        timerSet.add(id);
        return id;
    }


    return { mySetInterval, myClearInterval }
}