import { expect, test } from 'vitest';
import { omit } from '../tasks/loadash_omit';

test('omit removes the value at the specified path', () => {
    const obj: any = { a: 1, b: { c: 2, d: [3, 4] }, e: null };
    omit(obj, 'a');
    expect(obj.a).toBeUndefined();

    omit(obj, ['b', 'c']);
    expect(obj.b.c).toBeUndefined();

    omit(obj, 'b.d');
    expect(obj.b.d).toBeUndefined();

    omit(obj, ['b']);
    expect(obj.b).toBeUndefined();
});

test('omit handles number paths correctly', () => {
    const arr: any[] = [1, { a: 2 }, 3];
    omit(arr, '0');
    expect(arr[0]).toStrictEqual({ a: 2 });

    omit(arr, ['0', 'a']);
    expect(arr[0].a).toBeUndefined();
});

test('omit handles null and undefined objects without errors', () => {
    omit(null as any, 'a');
    omit(undefined as any, 'a');
});

test('omit handles non-existent paths without errors', () => {
    const obj: any = { a: 1 };
    omit(obj, 'b');
    expect(obj.a).toBe(1);

    omit(obj, ['c', 'd']);
    expect(obj.a).toBe(1);
});

test('omit handles array elements correctly', () => {
    const arr: any[] = [1, 2, 3];
    omit(arr, '1');
    expect(arr).toEqual([1, 3]);
});