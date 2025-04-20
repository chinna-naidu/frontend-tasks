type Handler = (...args: any) => void;
export class EventEmitter {
    eventMap = new Map<string, Handler[]>();

    addEventListener(event: string, cb: Handler) {
        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, []);
        }

        this.eventMap.get(event)?.push(cb);
    }

    removeEventListener(event: string, cb: Handler) {
        const handlerList = this.eventMap.has(event)
            ? this.eventMap.get(event)
            : [];

        const fitleredHandlerList = handlerList?.filter(
            (handler) => handler !== cb,
        );

        this.eventMap.set(event, fitleredHandlerList as Handler[]);
    }

    emitEvent(event: string, ...args: any[]) {
        const handlerList = this.eventMap.has(event)
            ? this.eventMap.get(event)
            : [];

        for (const cb of handlerList as Handler[]) {
            setImmediate(() => cb(...args));
        }
    }
}
