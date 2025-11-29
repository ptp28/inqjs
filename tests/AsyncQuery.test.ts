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

        it('should create from promise array', async () => {
            async function* fromArray(arr: number[]) {
                for (const x of arr) yield x;
            }
            const q = fromAsync(fromArray([1, 2]));
            expect(await q.toArray()).toEqual([1, 2]);
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
    });
});
