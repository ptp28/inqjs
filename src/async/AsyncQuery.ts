import { assertFunction, assertInteger, assertNonNegative } from '../utils/guards';
import { defaultComparer, identity } from '../utils/comparers';
import { whereAsync } from './operators/whereAsync';
import { selectAsync } from './operators/selectAsync';
import { orderByAsync } from './operators/orderByAsync';
import { skipAsync } from './operators/skipAsync';
import { distinctAsync } from './operators/distinctAsync';
import { anyAsync } from './operators/anyAsync';
import { allAsync } from './operators/allAsync';
import { sumAsync } from './operators/sumAsync';
import { minAsync } from './operators/minAsync';
import { maxAsync } from './operators/maxAsync';
import { firstAsync } from './operators/firstAsync';
import { toArrayAsync } from './operators/toArrayAsync';
import { takeAsync } from './operators/takeAsync';
import { countAsync } from './operators/countAsync';
import { appendAsync } from './operators/appendAsync';
import { prependAsync } from './operators/prependAsync';
import { concatAsync } from './operators/concatAsync';
import { unionAsync } from './operators/unionAsync';
import { intersectAsync } from './operators/intersectAsync';
import { exceptAsync } from './operators/exceptAsync';

export class AsyncQuery<T> implements AsyncIterable<T> {
    private readonly _source: AsyncIterable<T>;

    constructor(source: AsyncIterable<T>) {
        this._source = source;
    }

    public [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._source[Symbol.asyncIterator]();
    }

    public static from<T>(source: Iterable<T> | AsyncIterable<T>): AsyncQuery<T> {
        async function* wrap(src: Iterable<T> | AsyncIterable<T>) {
            for await (const item of src) {
                yield item;
            }
        }
        return new AsyncQuery(wrap(source));
    }

    public where(predicate: (item: T, index?: number) => boolean | Promise<boolean>): AsyncQuery<T> {
        assertFunction(predicate, 'predicate');
        return new AsyncQuery(whereAsync(this._source, predicate));
    }

    public select<U>(selector: (item: T, index?: number) => U | Promise<U>): AsyncQuery<U> {
        assertFunction(selector, 'selector');
        return new AsyncQuery(selectAsync(this._source, selector));
    }

    public orderBy<TKey = T>(
        keySelector: (item: T) => TKey | Promise<TKey> = identity as any,
        comparer: (a: TKey, b: TKey) => number = defaultComparer
    ): AsyncQuery<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        if (comparer !== undefined) assertFunction(comparer, 'comparer');
        return new AsyncQuery(orderByAsync(this._source, keySelector, comparer));
    }

    public skip(count: number): AsyncQuery<T> {
        assertInteger(count, 'count');
        assertNonNegative(count, 'count');
        return new AsyncQuery(skipAsync(this._source, count));
    }

    public distinct<TKey = T>(keySelector: (item: T) => TKey | Promise<TKey> = identity as any): AsyncQuery<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new AsyncQuery(distinctAsync(this._source, keySelector));
    }

    public any(predicate?: (item: T) => boolean | Promise<boolean>): Promise<boolean> {
        if (predicate !== undefined) assertFunction(predicate, 'predicate');
        return anyAsync(this._source, predicate);
    }

    public all(predicate: (item: T) => boolean | Promise<boolean>): Promise<boolean> {
        assertFunction(predicate, 'predicate');
        return allAsync(this._source, predicate);
    }

    public sum(selector: (item: T) => number | Promise<number> = identity as any): Promise<number> {
        if (selector !== undefined) assertFunction(selector, 'selector');
        return sumAsync(this._source, selector);
    }

    public min(selector: (item: T) => number | Promise<number> = identity as any): Promise<number | undefined> {
        if (selector !== undefined) assertFunction(selector, 'selector');
        return minAsync(this._source, selector);
    }

    public max(selector: (item: T) => number | Promise<number> = identity as any): Promise<number | undefined> {
        if (selector !== undefined) assertFunction(selector, 'selector');
        return maxAsync(this._source, selector);
    }

    public first(predicate?: (item: T) => boolean | Promise<boolean>): Promise<T> {
        if (predicate !== undefined) assertFunction(predicate, 'predicate');
        return firstAsync(this._source, predicate);
    }

    public toArray(): Promise<T[]> {
        return toArrayAsync(this._source);
    }

    public take(count: number): AsyncQuery<T> {
        assertInteger(count, 'count');
        assertNonNegative(count, 'count');
        return new AsyncQuery(takeAsync(this._source, count));
    }

    public count(predicate?: (item: T) => boolean | Promise<boolean>): Promise<number> {
        if (predicate !== undefined) assertFunction(predicate, 'predicate');
        return countAsync(this._source, predicate);
    }

    public append(element: T): AsyncQuery<T> {
        return new AsyncQuery(appendAsync(this._source, element));
    }

    public prepend(element: T): AsyncQuery<T> {
        return new AsyncQuery(prependAsync(this._source, element));
    }

    public concat(other: AsyncIterable<T>): AsyncQuery<T> {
        return new AsyncQuery(concatAsync(this._source, other));
    }

    public union<TKey = T>(other: AsyncIterable<T>, keySelector: (item: T) => TKey | Promise<TKey> = identity as any): AsyncQuery<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new AsyncQuery(unionAsync(this._source, other, keySelector));
    }

    public intersect<TKey = T>(other: AsyncIterable<T>, keySelector: (item: T) => TKey | Promise<TKey> = identity as any): AsyncQuery<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new AsyncQuery(intersectAsync(this._source, other, keySelector));
    }

    public except<TKey = T>(other: AsyncIterable<T>, keySelector: (item: T) => TKey | Promise<TKey> = identity as any): AsyncQuery<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new AsyncQuery(exceptAsync(this._source, other, keySelector));
    }
}

export function fromAsync<T>(source: AsyncIterable<T>): AsyncQuery<T> {
    return AsyncQuery.from(source);
}
