import { describe, expect, it } from 'vitest';
import { deepClone } from '../tasks/deep_clone';

describe('deepClone', () => {
    it('should clone primitive values', () => {
        expect(deepClone(1)).toBe(1);
        expect(deepClone('hello')).toBe('hello');
        expect(deepClone(true)).toBe(true);
        expect(deepClone(null)).toBe(null);
        expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone arrays', () => {
        const arr = [1, 2, 3];
        const clonedArr = deepClone(arr);
        expect(clonedArr).toEqual(arr);
        expect(clonedArr).not.toBe(arr);
    });

    it('should clone objects', () => {
        const obj = { a: 1, b: 'hello' };
        const clonedObj = deepClone(obj);
        expect(clonedObj).toEqual(obj);
        expect(clonedObj).not.toBe(obj);
    });

    it('should clone nested objects', () => {
        const obj = { a: 1, b: { c: 'hello' } };
        const clonedObj = deepClone(obj);
        expect(clonedObj).toEqual(obj);
        expect(clonedObj).not.toBe(obj);
        expect(clonedObj.b).not.toBe(obj.b);
    });

    it('should clone objects with symbols', () => {
        const sym = Symbol('test');
        const obj = { a: 1, [sym]: 'hello' };
        const clonedObj = deepClone(obj);
        expect(clonedObj).toEqual(obj);
        expect(clonedObj).not.toBe(obj);
    });
});