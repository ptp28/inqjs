import { describe, expect, it } from 'vitest';
import { from } from '../src/Query';
import { fromAsync } from '../src/async/AsyncQuery';

describe('LINQ feature operators', () => {
    describe('sync', () => {
        it('groupBy should group values by key in first-seen key order', () => {
            const result = from([
                { category: 'fruit', name: 'apple' },
                { category: 'veg', name: 'carrot' },
                { category: 'fruit', name: 'pear' },
            ])
                .groupBy(x => x.category, x => x.name)
                .select(group => ({ key: group.key, values: Array.from(group) }))
                .toArray();

            expect(result).toEqual([
                { key: 'fruit', values: ['apple', 'pear'] },
                { key: 'veg', values: ['carrot'] },
            ]);
        });

        it('groupBy should use the original item when no element selector is provided', () => {
            const result = from([1, 2, 3, 4])
                .groupBy(x => x % 2 === 0 ? 'even' : 'odd')
                .select(group => ({ key: group.key, values: group.values }))
                .toArray();

            expect(result).toEqual([
                { key: 'odd', values: [1, 3] },
                { key: 'even', values: [2, 4] },
            ]);
        });

        it('groupBy should throw when selectors are invalid', () => {
            expect(() => from([1]).groupBy(undefined as any)).toThrow('keySelector must be a function');
            expect(() => from([1]).groupBy(x => x, 123 as any)).toThrow('elementSelector must be a function');
        });

        it('join should return matching outer and inner pairs', () => {
            const users = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
            ];
            const orders = [
                { userId: 1, total: 10 },
                { userId: 1, total: 20 },
                { userId: 3, total: 30 },
            ];

            const result = from(users)
                .join(
                    orders,
                    user => user.id,
                    order => order.userId,
                    (user, order) => `${user.name}:${order.total}`
                )
                .toArray();

            expect(result).toEqual(['Alice:10', 'Alice:20']);
        });

        it('join should return an empty sequence when there are no matches', () => {
            const result = from([{ id: 1 }])
                .join(
                    [{ userId: 2 }],
                    user => user.id,
                    order => order.userId,
                    (user, order) => ({ user, order })
                )
                .toArray();

            expect(result).toEqual([]);
        });

        it('join should preserve duplicate inner matches in source order', () => {
            const result = from([{ id: 1, name: 'Alice' }, { id: 1, name: 'Ally' }])
                .join(
                    [{ userId: 1, total: 10 }, { userId: 1, total: 20 }],
                    user => user.id,
                    order => order.userId,
                    (user, order) => `${user.name}:${order.total}`
                )
                .toArray();

            expect(result).toEqual(['Alice:10', 'Alice:20', 'Ally:10', 'Ally:20']);
        });

        it('join should validate inputs and selectors', () => {
            const query = from([{ id: 1 }]);

            expect(() => query.join(123 as any, x => x.id, x => x, (outer, inner) => ({ outer, inner })))
                .toThrow('inner must be an iterable');
            expect(() => query.join([], undefined as any, x => x, (outer, inner) => ({ outer, inner })))
                .toThrow('outerKeySelector must be a function');
            expect(() => query.join([], x => x.id, undefined as any, (outer, inner) => ({ outer, inner })))
                .toThrow('innerKeySelector must be a function');
            expect(() => query.join([], x => x.id, x => x, undefined as any))
                .toThrow('resultSelector must be a function');
        });

        it('selectMany should flatten collections and support result selectors', () => {
            const result = from([
                { name: 'a', values: [1, 2] },
                { name: 'b', values: [3] },
            ])
                .selectMany(
                    item => item.values,
                    (item, value) => `${item.name}${value}`
                )
                .toArray();

            expect(result).toEqual(['a1', 'a2', 'b3']);
        });

        it('selectMany should flatten collections without a result selector', () => {
            const result = from([[1, 2], [3], []])
                .selectMany(values => values)
                .toArray();

            expect(result).toEqual([1, 2, 3]);
        });

        it('selectMany should pass the source index to the collection selector', () => {
            const result = from(['a', 'b'])
                .selectMany((item, index) => [`${item}${index}`])
                .toArray();

            expect(result).toEqual(['a0', 'b1']);
        });

        it('selectMany should validate selectors', () => {
            expect(() => from([1]).selectMany(undefined as any)).toThrow('collectionSelector must be a function');
            expect(() => from([1]).selectMany(x => [x], 123 as any)).toThrow('resultSelector must be a function');
        });

        it('thenBy should preserve earlier sort criteria', () => {
            const result = from([
                { last: 'Smith', first: 'Zoey' },
                { last: 'Adams', first: 'Mary' },
                { last: 'Smith', first: 'Ada' },
            ])
                .orderBy(x => x.last)
                .thenBy(x => x.first)
                .select(x => `${x.last}, ${x.first}`)
                .toArray();

            expect(result).toEqual(['Adams, Mary', 'Smith, Ada', 'Smith, Zoey']);
        });

        it('thenBy should support custom comparers and multiple levels', () => {
            const result = from([
                { team: 'a', score: 10, name: 'Zed' },
                { team: 'a', score: 20, name: 'Ann' },
                { team: 'a', score: 20, name: 'Bob' },
                { team: 'b', score: 5, name: 'Cal' },
            ])
                .orderBy(x => x.team)
                .thenBy(x => x.score, (a, b) => b - a)
                .thenBy(x => x.name)
                .select(x => `${x.team}:${x.score}:${x.name}`)
                .toArray();

            expect(result).toEqual(['a:20:Ann', 'a:20:Bob', 'a:10:Zed', 'b:5:Cal']);
        });

        it('thenBy should validate selectors and comparers', () => {
            const ordered = from([1]).orderBy();

            expect(() => ordered.thenBy(123 as any)).toThrow('keySelector must be a function');
            expect(() => ordered.thenBy(x => x, 123 as any)).toThrow('comparer must be a function');
        });
    });

    describe('async', () => {
        async function* users() {
            yield { id: 1, name: 'Alice' };
            yield { id: 2, name: 'Bob' };
        }

        async function* orders() {
            yield { userId: 1, total: 10 };
            yield { userId: 1, total: 20 };
        }

        it('groupBy should support async selectors', async () => {
            const result = await fromAsync([1, 2, 3, 4])
                .groupBy(async x => x % 2, async x => x * 10)
                .select(group => ({ key: group.key, values: Array.from(group) }))
                .toArray();

            expect(result).toEqual([
                { key: 1, values: [10, 30] },
                { key: 0, values: [20, 40] },
            ]);
        });

        it('groupBy should use the original item by default', async () => {
            const result = await fromAsync([1, 2, 3])
                .groupBy(async x => x > 1)
                .select(group => ({ key: group.key, values: group.values }))
                .toArray();

            expect(result).toEqual([
                { key: false, values: [1] },
                { key: true, values: [2, 3] },
            ]);
        });

        it('groupBy should reject invalid selectors', () => {
            expect(() => fromAsync([1]).groupBy(undefined as any)).toThrow('keySelector must be a function');
            expect(() => fromAsync([1]).groupBy(x => x, 123 as any)).toThrow('elementSelector must be a function');
        });

        it('join should accept sync inner sources and async selectors', async () => {
            const result = await fromAsync(users())
                .join(
                    [{ userId: 1, total: 10 }, { userId: 2, total: 20 }],
                    async user => user.id,
                    async order => order.userId,
                    async (user, order) => `${user.name}:${order.total}`
                )
                .toArray();

            expect(result).toEqual(['Alice:10', 'Bob:20']);
        });

        it('join should accept async inner sources', async () => {
            const result = await fromAsync(users())
                .join(
                    orders(),
                    user => user.id,
                    order => order.userId,
                    (user, order) => `${user.name}:${order.total}`
                )
                .toArray();

            expect(result).toEqual(['Alice:10', 'Alice:20']);
        });

        it('join should validate async inputs and selectors', () => {
            const query = fromAsync([{ id: 1 }]);

            expect(() => query.join(123 as any, x => x.id, x => x, (outer, inner) => ({ outer, inner })))
                .toThrow('inner must be an iterable or async iterable');
            expect(() => query.join([], undefined as any, x => x, (outer, inner) => ({ outer, inner })))
                .toThrow('outerKeySelector must be a function');
            expect(() => query.join([], x => x.id, undefined as any, (outer, inner) => ({ outer, inner })))
                .toThrow('innerKeySelector must be a function');
            expect(() => query.join([], x => x.id, x => x, undefined as any))
                .toThrow('resultSelector must be a function');
        });

        it('selectMany should flatten async collections', async () => {
            async function* values(items: number[]) {
                for (const item of items) yield item;
            }

            const result = await fromAsync([{ name: 'a', values: [1, 2] }])
                .selectMany(
                    item => values(item.values),
                    async (item, value) => `${item.name}${value}`
                )
                .toArray();

            expect(result).toEqual(['a1', 'a2']);
        });

        it('selectMany should flatten sync collections without a result selector', async () => {
            const result = await fromAsync([[1, 2], [3]])
                .selectMany(values => values)
                .toArray();

            expect(result).toEqual([1, 2, 3]);
        });

        it('selectMany should accept a promised collection', async () => {
            const result = await fromAsync(['a', 'b'])
                .selectMany(async (item, index) => [`${item}${index}`])
                .toArray();

            expect(result).toEqual(['a0', 'b1']);
        });

        it('selectMany should validate async selectors', () => {
            expect(() => fromAsync([1]).selectMany(undefined as any)).toThrow('collectionSelector must be a function');
            expect(() => fromAsync([1]).selectMany(x => [x], 123 as any)).toThrow('resultSelector must be a function');
        });

        it('thenBy should support async key selectors', async () => {
            const result = await fromAsync([
                { last: 'Smith', first: 'Zoey' },
                { last: 'Adams', first: 'Mary' },
                { last: 'Smith', first: 'Ada' },
            ])
                .orderBy(async x => x.last)
                .thenBy(async x => x.first)
                .select(x => `${x.last}, ${x.first}`)
                .toArray();

            expect(result).toEqual(['Adams, Mary', 'Smith, Ada', 'Smith, Zoey']);
        });

        it('thenBy should support async custom comparers and multiple levels', async () => {
            const result = await fromAsync([
                { team: 'a', score: 10, name: 'Zed' },
                { team: 'a', score: 20, name: 'Ann' },
                { team: 'a', score: 20, name: 'Bob' },
                { team: 'b', score: 5, name: 'Cal' },
            ])
                .orderBy(async x => x.team)
                .thenBy(async x => x.score, (a, b) => b - a)
                .thenBy(async x => x.name)
                .select(x => `${x.team}:${x.score}:${x.name}`)
                .toArray();

            expect(result).toEqual(['a:20:Ann', 'a:20:Bob', 'a:10:Zed', 'b:5:Cal']);
        });

        it('thenBy should validate async selectors and comparers', () => {
            const ordered = fromAsync([1]).orderBy();

            expect(() => ordered.thenBy(123 as any)).toThrow('keySelector must be a function');
            expect(() => ordered.thenBy(x => x, 123 as any)).toThrow('comparer must be a function');
        });
    });
});
