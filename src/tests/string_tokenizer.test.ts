import { expect, test } from 'vitest';
import { StingTokenizer } from '../tasks/string_tokenizer';

test('StringTokenizer tokenizes simple expressions', () => {
    const tokenizer = new StingTokenizer('1 + 23');
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 1 });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '+' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 23 });
    expect(tokenizer.getNextToken()).toBeNull();
});

test('StringTokenizer tokenizes expressions with multiple operators', () => {
    const tokenizer = new StingTokenizer('1 + 234 * 345');
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 1 });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '+' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 234 });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '*' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 345 });
    expect(tokenizer.getNextToken()).toBeNull();
});

test('StringTokenizer tokenizes expressions with parentheses', () => {
    const tokenizer = new StingTokenizer('(111 + 22) * 34');
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '(' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 111 });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '+' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 22 });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: ')' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '*' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 34 });
    expect(tokenizer.getNextToken()).toBeNull();
});

test('StringTokenizer skips whitespace', () => {
    const tokenizer = new StingTokenizer('   111   +   2   ');
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 111 });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '+' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 2 });
    expect(tokenizer.getNextToken()).toBeNull();
});

test('StringTokenizer handles consecutive operators', () => {
    const tokenizer = new StingTokenizer('1 + -22');
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 1 });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '+' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'operator', token: '-' });
    expect(tokenizer.getNextToken()).toEqual({ type: 'number', token: 22 });
    expect(tokenizer.getNextToken()).toBeNull();
});

test('StringTokenizer handles empty string', () => {
    const tokenizer = new StingTokenizer('');
    expect(tokenizer.getNextToken()).toBeNull();
});

test('StringTokenizer handles only whitespace', () => {
    const tokenizer = new StingTokenizer('   ');
    expect(tokenizer.getNextToken()).toBeNull();
});