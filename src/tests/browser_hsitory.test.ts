import { describe, it, expect } from 'vitest';
import { BrowserHistory } from '../tasks/browser_hsitory';

describe('BrowserHistory', () => {
    it('should initialize with a given url', () => {
        const history = new BrowserHistory('google.com');
        expect(history.forward()).toBe('google.com');
        expect(history.backward()).toBe('google.com');
    });

    it('should visit a new url', () => {
        const history = new BrowserHistory('google.com');
        history.visit('youtube.com');
        expect(history.forward()).toBe('youtube.com');
        expect(history.backward()).toBe('google.com');
    });

    it('should move forward in history', () => {
        const history = new BrowserHistory('google.com');
        history.visit('youtube.com');
        history.visit('facebook.com');
        expect(history.backward()).toBe('youtube.com');
        expect(history.backward()).toBe('google.com');
        expect(history.forward()).toBe('youtube.com');
        expect(history.forward()).toBe('facebook.com');
    });

    it('should clear forward history when visiting a new url', () => {
        const history = new BrowserHistory('google.com');
        history.visit('youtube.com');
        history.backward();
        history.visit('facebook.com');
        expect(history.forward()).toBe('facebook.com');
    });
});