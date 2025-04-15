import { expect, test } from 'vitest';
import { get } from '../tasks/loadash_get';

const obj = {
    a: 1,
    b: { c: 2, d: [3, 4] },
    e: null,
};

test('get returns the value at the specified path', () => {
    expect(get(obj, 'a', null)).toBe(1);
    expect(get(obj, ['b', 'c'], null)).toBe(2);
    expect(get(obj, 'b.c', null)).toBe(2);
    expect(get(obj, ['b', 'd', '0'], null)).toBe(3);
    expect(get(obj, 'b.d.0', null)).toBe(3);
});

test('get returns the default value when the path does not exist', () => {
    expect(get(obj, 'f', 'default')).toBe('default');
    expect(get(obj, ['b', 'e'], 'default')).toBe('default');
    expect(get(obj, 'b.e', 'default')).toBe('default');
    expect(get(obj, ['b', 'd', '2'], 'default')).toBe('default');
    expect(get(obj, 'b.d.2', 'default')).toBe('default');
});

test('get handles null and undefined objects', () => {
    expect(get(null as any, 'a', 'default')).toBe('default');
    expect(get(undefined as any, 'a', 'default')).toBe('default');
});

test('get handles null values in the object', () => {
    expect(get(obj, 'e', 'default')).toBe('default');
});