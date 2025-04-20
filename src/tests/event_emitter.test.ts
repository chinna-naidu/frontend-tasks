import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '../tasks/event_emitter';

describe('EventEmitter', () => {
    it('should add an event listener', () => {
        const emitter = new EventEmitter();
        const handler = vi.fn();
        emitter.addEventListener('test', handler);
        emitter.emitEvent('test');
        setTimeout(() => {
            expect(handler).toHaveBeenCalledTimes(1);
        }, 10)
    });

    it('should remove an event listener', () => {
        const emitter = new EventEmitter();
        const handler = vi.fn();
        emitter.addEventListener('test', handler);
        emitter.removeEventListener('test', handler);
        emitter.emitEvent('test');
        expect(handler).not.toHaveBeenCalled();
    });

    it('should emit an event with arguments', () => {
        const emitter = new EventEmitter();
        const handler = vi.fn();
        emitter.addEventListener('test', handler);
        emitter.emitEvent('test', 1, 'hello');
        setTimeout(() => {
            expect(handler).toHaveBeenCalledWith(1, 'hello');
        }, 10)
    });

    it('should not emit an event if there are no listeners', () => {
        const emitter = new EventEmitter();
        const handler = vi.fn();
        emitter.emitEvent('test', 1, 'hello');
        expect(handler).not.toHaveBeenCalled();
    });
});