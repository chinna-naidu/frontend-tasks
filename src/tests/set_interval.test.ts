import { describe, it, expect, vi } from 'vitest';
import { createSetInterval } from '../tasks/set_interval';
import { setTimeout } from 'node:timers/promises';

describe('createSetInterval', () => {




    it('should call the callback function repeatedly after the specified time', async () => {
        vi.useRealTimers()


        const { mySetInterval, myClearInterval } = createSetInterval();
        const fn = vi.fn();
        const id = mySetInterval(fn, 50);


        await setTimeout(170);

        expect(fn).toHaveBeenCalledTimes(3);
        myClearInterval(id);
    });

    it('should not call the callback function if clearInterval is called', () => {
        const { mySetInterval, myClearInterval } = createSetInterval();
        const fn = vi.fn();
        const id = mySetInterval(fn, 100);
        myClearInterval(id);
        expect(fn).not.toHaveBeenCalled();
    });

    it('should return a unique timer id for each setInterval call', () => {
        const { mySetInterval, myClearInterval } = createSetInterval();
        const id1 = mySetInterval(() => { }, 100);
        const id2 = mySetInterval(() => { }, 200);

        myClearInterval(id1);
        myClearInterval(id2);

        expect(id1).not.toBe(id2);
    });
});