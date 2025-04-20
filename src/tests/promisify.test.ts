import { describe, it, expect } from 'vitest';
import { promisify } from '../tasks/promisify';
describe('promisify', () => {
    it('should resolve with the result when the callback is successful', async () => {
        const callbackFn = (cb: (err: Error | null, result: string | null) => void, data: number) => {
            process.nextTick(() => cb(null, `Result: ${data}`))
        };

        const promisifiedFn = promisify(callbackFn);
        const result = await promisifiedFn(10);

        expect(result).toBe('Result: 10');
    });

    it('should reject with the error when the callback returns an error', async () => {
        const callbackFn = (cb: (err: Error, result?: string) => void, data: number) => {
            process.nextTick(() => cb(new Error('Something went wrong')))
        };

        const promisifiedFn = promisify(callbackFn);

        await expect(promisifiedFn(10)).rejects.toThrow('Something went wrong');
    });
});