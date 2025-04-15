import { expect, test } from 'vitest';
import { typeOf } from '../tasks/typeof';

test('typeOf returns the correct type for different values', () => {
  expect(typeOf(1)).toBe('number');
  expect(typeOf('hello')).toBe('string');
  expect(typeOf(true)).toBe('boolean');
  expect(typeOf(null)).toBe('null');
  expect(typeOf(undefined)).toBe('undefined');
  expect(typeOf([])).toBe('array');
  expect(typeOf({})).toBe('object');
  expect(typeOf(new Date())).toBe('date');
  expect(typeOf(new Set())).toBe('set');
  expect(typeOf(new Map())).toBe('map');
  expect(typeOf(Symbol('test'))).toBe('symbol');
});