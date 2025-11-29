import { describe, it, expect } from 'vitest';
import { from } from '../src/Query';

describe('Query (Sync)', () => {
    describe('Creation', () => {
        it('should create from array', () => {
            const q = from([1, 2, 3]);
            expect(q.toArray()).toEqual([1, 2, 3]);
        });

        it('should create from generator', () => {
            function* gen() { yield 1; yield 2; }
            const q = from(gen());
            expect(q.toArray()).toEqual([1, 2]);
        });

        it('should create from Map', () => {
            const map = new Map([['a', 1], ['b', 2]]);
            const q = from(map);
            expect(q.toArray()).toEqual([['a', 1], ['b', 2]]);
        });

        it('should handle empty source', () => {
            expect(from([]).toArray()).toEqual([]);
        });
    });

    describe('Filtering', () => {
        it('where should filter elements', () => {
            const q = from([1, 2, 3, 4]).where(x => x % 2 === 0);
            expect(q.toArray()).toEqual([2, 4]);
        });

        it('where should use index', () => {
            const q = from(['a', 'b', 'c']).where((_, i) => i! % 2 === 0);
            expect(q.toArray()).toEqual(['a', 'c']);
        });
    });

    describe('Projection', () => {
        it('select should transform elements', () => {
            const q = from([1, 2, 3]).select(x => x * 2);
            expect(q.toArray()).toEqual([2, 4, 6]);
        });

        it('select should use index', () => {
            const q = from(['a', 'b']).select((x, i) => `${x}${i}`);
            expect(q.toArray()).toEqual(['a0', 'b1']);
        });
    });

    describe('Ordering', () => {
        it('orderBy should sort numbers ascending by default', () => {
            const q = from([3, 1, 2]).orderBy();
            expect(q.toArray()).toEqual([1, 2, 3]);
        });

        it('orderBy should sort by key', () => {
            const list = [{ id: 3 }, { id: 1 }, { id: 2 }];
            const q = from(list).orderBy(x => x.id);
            expect(q.toArray()).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        });

        it('orderBy should use custom comparer', () => {
            const q = from([1, 2, 3]).orderBy(x => x, (a, b) => b - a);
            expect(q.toArray()).toEqual([3, 2, 1]);
        });
    });

    describe('Partitioning', () => {
        it('skip should skip elements', () => {
            const q = from([1, 2, 3, 4]).skip(2);
            expect(q.toArray()).toEqual([3, 4]);
        });

        it('skip should handle count > length', () => {
            const q = from([1, 2]).skip(5);
            expect(q.toArray()).toEqual([]);
        });

        it('skip should throw on negative count', () => {
            expect(() => from([]).skip(-1)).toThrow();
        });
    });

    describe('Set Operations', () => {
        it('distinct should remove duplicates', () => {
            const q = from([1, 2, 2, 3]).distinct();
            expect(q.toArray()).toEqual([1, 2, 3]);
        });

        it('distinct should use key selector', () => {
            const list = [{ id: 1, val: 'a' }, { id: 1, val: 'b' }, { id: 2, val: 'c' }];
            const q = from(list).distinct(x => x.id);
            expect(q.toArray()).toEqual([{ id: 1, val: 'a' }, { id: 2, val: 'c' }]);
        });
    });

    describe('Quantifiers', () => {
        it('any should return true if any match', () => {
            expect(from([1, 2, 3]).any(x => x > 2)).toBe(true);
        });

        it('any should return false if none match', () => {
            expect(from([1, 2, 3]).any(x => x > 5)).toBe(false);
        });

        it('any without predicate should return true for non-empty', () => {
            expect(from([1]).any()).toBe(true);
        });

        it('any without predicate should return false for empty', () => {
            expect(from([]).any()).toBe(false);
        });

        it('all should return true if all match', () => {
            expect(from([1, 2, 3]).all(x => x > 0)).toBe(true);
        });

        it('all should return false if one fails', () => {
            expect(from([1, 2, 3]).all(x => x < 3)).toBe(false);
        });

        it('all should return true for empty', () => {
            expect(from([]).all(x => x > 0)).toBe(true);
        });
    });

    describe('Aggregates', () => {
        it('sum should sum numbers', () => {
            expect(from([1, 2, 3]).sum()).toBe(6);
        });

        it('sum should use selector', () => {
            expect(from([{ val: 1 }, { val: 2 }]).sum(x => x.val)).toBe(3);
        });

        it('sum of empty should be 0', () => {
            expect(from([]).sum()).toBe(0);
        });

        it('min should return min value', () => {
            expect(from([3, 1, 2]).min()).toBe(1);
        });

        it('min of empty should be undefined', () => {
            expect(from([]).min()).toBeUndefined();
        });

        it('max should return max value', () => {
            expect(from([1, 3, 2]).max()).toBe(3);
        });
    });

    describe('Element', () => {
        it('first should return first element', () => {
            expect(from([1, 2]).first()).toBe(1);
        });

        it('first with predicate should return first match', () => {
            expect(from([1, 2, 3]).first(x => x > 1)).toBe(2);
        });

        it('first should throw if empty', () => {
            expect(() => from([]).first()).toThrow('Sequence contains no matching element');
        });

        it('first should throw if no match', () => {
            expect(() => from([1, 2]).first(x => x > 5)).toThrow('Sequence contains no matching element');
        });
    });

    describe('Conversion', () => {
        it('toAsync should convert to AsyncQuery', async () => {
            const aq = from([1, 2]).toAsync();
            expect(await aq.toArray()).toEqual([1, 2]);
        });
    });
});
