import { describe, it, expect } from 'vitest';
import { fromAsync } from '../src/async/AsyncQuery';

describe('AsyncQuery', () => {
    async function* asyncGen() {
        yield 1; yield 2; yield 3;
    }

    describe('Creation', () => {
        it('should create from async generator', async () => {
            const q = fromAsync(asyncGen());
            expect(await q.toArray()).toEqual([1, 2, 3]);
        });

        it('should create from sync iterable', async () => {
            const q = fromAsync([1, 2, 3]);
            expect(await q.toArray()).toEqual([1, 2, 3]);
        });

        it('should create from promise array', async () => {
            async function* fromArray(arr: number[]) {
                for (const x of arr) yield x;
            }
            const q = fromAsync(fromArray([1, 2]));
            expect(await q.toArray()).toEqual([1, 2]);
        });

        it('should throw for non-iterable source', () => {
            expect(() => fromAsync(123 as any)).toThrow('source must be an iterable or async iterable');
        });
    });

    describe('Operators', () => {
        it('where should filter async', async () => {
            const q = fromAsync(asyncGen()).where(async x => x % 2 !== 0);
            expect(await q.toArray()).toEqual([1, 3]);
        });

        it('select should map async', async () => {
            const q = fromAsync(asyncGen()).select(async x => x * 2);
            expect(await q.toArray()).toEqual([2, 4, 6]);
        });

        it('orderBy should sort async', async () => {
            async function* unsorted() { yield 3; yield 1; yield 2; }
            const q = fromAsync(unsorted()).orderBy();
            expect(await q.toArray()).toEqual([1, 2, 3]);
        });

        it('skip should skip async', async () => {
            const q = fromAsync(asyncGen()).skip(2);
            expect(await q.toArray()).toEqual([3]);
        });

        it('distinct should dedupe async', async () => {
            async function* dupes() { yield 1; yield 2; yield 2; yield 3; }
            const q = fromAsync(dupes()).distinct();
            expect(await q.toArray()).toEqual([1, 2, 3]);
        });

        it('concat should accept sync iterable', async () => {
            const result = await fromAsync(asyncGen()).concat([4, 5]).toArray();
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });

        it('union should accept sync iterable', async () => {
            const result = await fromAsync(asyncGen()).union([3, 4, 5]).toArray();
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });

        it('intersect should accept sync iterable', async () => {
            const result = await fromAsync(asyncGen()).intersect([2, 3, 4]).toArray();
            expect(result).toEqual([2, 3]);
        });

        it('except should accept sync iterable', async () => {
            const result = await fromAsync(asyncGen()).except([2, 4]).toArray();
            expect(result).toEqual([1, 3]);
        });

        it('set operations should accept async key selectors with sync iterable inputs', async () => {
            const list = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
            const other = [{ id: 2, name: 'c' }, { id: 3, name: 'd' }];
            const result = await fromAsync(list).union(other, async x => x.id).toArray();
            expect(result).toEqual([
                { id: 1, name: 'a' },
                { id: 2, name: 'b' },
                { id: 3, name: 'd' },
            ]);
        });

        it('concat should throw for non-iterable other source', () => {
            expect(() => fromAsync(asyncGen()).concat(123 as any)).toThrow('other must be an iterable or async iterable');
        });
    });

    describe('Aggregates & Quantifiers', () => {
        it('sum should sum async', async () => {
            expect(await fromAsync(asyncGen()).sum()).toBe(6);
        });

        it('first should return first async', async () => {
            expect(await fromAsync(asyncGen()).first()).toBe(1);
        });

        it('any should work async', async () => {
            expect(await fromAsync(asyncGen()).any(x => x > 2)).toBe(true);
        });

        it('sum should reject non-finite selected values', async () => {
            await expect(fromAsync([1, Number.POSITIVE_INFINITY]).sum()).rejects.toThrow('sumAsync: value must be a finite number');
        });
    });
});
