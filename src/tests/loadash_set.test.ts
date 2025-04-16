import { expect, test } from 'vitest';
import { set } from '../tasks/loadash_set';

test('set sets the value at the specified path', () => {
    const obj: any = {};
    set(obj, 'a', 1);
    expect(obj.a).toBe(1);

    set(obj, ['b', 'c'], 2);
    expect(obj.b.c).toBe(2);

    set(obj, 'b.d', 3);
    expect(obj.b.d).toBe(3);

    set(obj, ['e', 'f', '0'], 4);
    expect(obj.e.f[0]).toBe(4);

    set(obj, 'g.h.1', 5);
    expect(obj.g.h[1]).toBe(5);
});

test('set handles number paths correctly', () => {
    const obj: any = {};
    set(obj, '0', 1);
    expect(obj[0]).toBe(1);

    const arr: any[] = [];
    set(arr, ['0', 'a'], 2);
    expect(arr[0].a).toBe(2);

    set(arr, '1.b', 3);
    expect(arr[1].b).toBe(3);
});

test('set handles null and undefined objects without errors', () => {
    set(null as any, 'a', 1);
    set(undefined as any, 'a', 1);
});

test('set handles existing values correctly', () => {
    const obj: any = { a: 1 };
    set(obj, 'a', 2);
    expect(obj.a).toBe(2);

    const arr: any[] = [1];
    set(arr, '0', 2);
    expect(arr[0]).toBe(2);
});