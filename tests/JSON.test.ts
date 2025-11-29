import { describe, it, expect } from 'vitest';
import { fromJson, fromJsonArray, fromJsonObject } from '../src/Query';

describe('JSON Query', () => {
    describe('fromJsonArray', () => {
        it('should parse and query JSON array', () => {
            const json = '[1, 2, 3, 4, 5]';
            const result = fromJsonArray<number>(json)
                .where(x => x % 2 === 0)
                .toArray();
            expect(result).toEqual([2, 4]);
        });

        it('should work with array of objects', () => {
            const json = '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]';
            const result = fromJsonArray<{ id: number; name: string }>(json)
                .select(x => x.name)
                .toArray();
            expect(result).toEqual(['Alice', 'Bob']);
        });

        it('should throw if JSON is not an array', () => {
            expect(() => fromJsonArray('{"key": "value"}')).toThrow('JSON value is not an array');
        });
    });

    describe('fromJsonObject', () => {
        it('should parse and query JSON object entries', () => {
            const json = '{"a": 1, "b": 2, "c": 3}';
            const result = fromJsonObject<number>(json)
                .where(([key, value]) => value > 1)
                .select(([key, value]) => key)
                .toArray();
            expect(result).toEqual(['b', 'c']);
        });

        it('should throw if JSON is not an object', () => {
            expect(() => fromJsonObject('[1, 2, 3]')).toThrow('JSON value is not an object');
        });

        it('should throw if JSON is null', () => {
            expect(() => fromJsonObject('null')).toThrow('JSON value is not an object');
        });
    });

    describe('fromJson', () => {
        it('should handle JSON array', () => {
            const json = '[1, 2, 3]';
            const result = fromJson<number>(json).toArray();
            expect(result).toEqual([1, 2, 3]);
        });

        it('should handle JSON object as entries', () => {
            const json = '{"x": 10, "y": 20}';
            const result = fromJson<[string, number]>(json).toArray();
            expect(result).toEqual([['x', 10], ['y', 20]]);
        });

        it('should handle primitive values', () => {
            expect(fromJson<number>('42').toArray()).toEqual([42]);
            expect(fromJson<string>('"hello"').toArray()).toEqual(['hello']);
            expect(fromJson<boolean>('true').toArray()).toEqual([true]);
        });

        it('should throw on invalid JSON', () => {
            expect(() => fromJson('invalid json')).toThrow();
        });
    });
});
