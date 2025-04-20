import { describe, it, expect, vi } from 'vitest';
import { createSetTimeout } from '../tasks/set_timeout';

describe('createSetTimeout', () => {

    it('should call the callback function after the specified time', () => {
        vi.useRealTimers();
        const { mySetTimeout } = createSetTimeout();
        const fn = vi.fn();
        mySetTimeout(fn, 0);
        setTimeout(() => {
            expect(fn).toHaveBeenCalledTimes(1);
        })
    });

    it('should not call the callback function if clearTimeout is called', () => {
        const { mySetTimeout, myClearTimeout } = createSetTimeout();
        const fn = vi.fn();
        const id = mySetTimeout(fn, 0);
        myClearTimeout(id);
        expect(fn).not.toHaveBeenCalled();
    });

    it('should return a unique timer id for each setTimeout call', () => {
        const { mySetTimeout } = createSetTimeout();
        const id1 = mySetTimeout(() => { }, 0);
        const id2 = mySetTimeout(() => { }, 0);
        expect(id1).not.toBe(id2);
    });
});