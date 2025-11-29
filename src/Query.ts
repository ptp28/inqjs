import { assertIterable, assertFunction, assertInteger, assertNonNegative } from './utils/guards';
import { defaultComparer, identity } from './utils/comparers';
import { where } from './operators/where';
import { select } from './operators/select';
import { orderBy } from './operators/orderBy';
import { skip } from './operators/skip';
import { distinct } from './operators/distinct';
import { any } from './operators/any';
import { all } from './operators/all';
import { sum } from './operators/sum';
import { min } from './operators/min';
import { max } from './operators/max';
import { first } from './operators/first';
import { toArray } from './operators/toArray';
import { take } from './operators/take';
import { count } from './operators/count';
import { append } from './operators/append';
import { prepend } from './operators/prepend';
import { concat } from './operators/concat';
import { union } from './operators/union';
import { intersect } from './operators/intersect';
import { except } from './operators/except';
import { AsyncQuery } from './async/AsyncQuery';

export class Query<T> implements Iterable<T> {
    private readonly _source: Iterable<T>;

    constructor(source: Iterable<T>) {
        assertIterable(source, 'source');
        this._source = source;
    }

    public [Symbol.iterator](): Iterator<T> {
        return this._source[Symbol.iterator]();
    }

    public static from<T>(source: Iterable<T>): Query<T> {
        if (source instanceof Map) {
            return new Query(source.entries() as unknown as Iterable<T>);
        }
        return new Query(source);
    }

    public where(predicate: (item: T, index?: number) => boolean): Query<T> {
        assertFunction(predicate, 'predicate');
        return new Query(where(this._source, predicate));
    }

    public select<U>(selector: (item: T, index?: number) => U): Query<U> {
        assertFunction(selector, 'selector');
        return new Query(select(this._source, selector));
    }

    public orderBy<TKey = T>(
        keySelector: (item: T) => TKey = identity as any,
        comparer: (a: TKey, b: TKey) => number = defaultComparer
    ): Query<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        if (comparer !== undefined) assertFunction(comparer, 'comparer');
        return new Query(orderBy(this._source, keySelector, comparer));
    }

    public skip(count: number): Query<T> {
        assertInteger(count, 'count');
        assertNonNegative(count, 'count');
        return new Query(skip(this._source, count));
    }

    public distinct<TKey = T>(keySelector: (item: T) => TKey = identity as any): Query<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new Query(distinct(this._source, keySelector));
    }

    public any(predicate?: (item: T) => boolean): boolean {
        if (predicate !== undefined) assertFunction(predicate, 'predicate');
        return any(this._source, predicate);
    }

    public all(predicate: (item: T) => boolean): boolean {
        assertFunction(predicate, 'predicate');
        return all(this._source, predicate);
    }

    public sum(selector: (item: T) => number = identity as any): number {
        if (selector !== undefined) assertFunction(selector, 'selector');
        return sum(this._source, selector);
    }

    public min(selector: (item: T) => number = identity as any): number | undefined {
        if (selector !== undefined) assertFunction(selector, 'selector');
        return min(this._source, selector);
    }

    public max(selector: (item: T) => number = identity as any): number | undefined {
        if (selector !== undefined) assertFunction(selector, 'selector');
        return max(this._source, selector);
    }

    public first(predicate?: (item: T) => boolean): T {
        if (predicate !== undefined) assertFunction(predicate, 'predicate');
        return first(this._source, predicate);
    }

    public toArray(): T[] {
        return toArray(this._source);
    }

    public take(count: number): Query<T> {
        assertInteger(count, 'count');
        assertNonNegative(count, 'count');
        return new Query(take(this._source, count));
    }

    public count(predicate?: (item: T) => boolean): number {
        if (predicate !== undefined) assertFunction(predicate, 'predicate');
        return count(this._source, predicate);
    }

    public append(element: T): Query<T> {
        return new Query(append(this._source, element));
    }

    public prepend(element: T): Query<T> {
        return new Query(prepend(this._source, element));
    }

    public concat(other: Iterable<T>): Query<T> {
        assertIterable(other, 'other');
        return new Query(concat(this._source, other));
    }

    public union<TKey = T>(other: Iterable<T>, keySelector: (item: T) => TKey = identity as any): Query<T> {
        assertIterable(other, 'other');
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new Query(union(this._source, other, keySelector));
    }

    public intersect<TKey = T>(other: Iterable<T>, keySelector: (item: T) => TKey = identity as any): Query<T> {
        assertIterable(other, 'other');
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new Query(intersect(this._source, other, keySelector));
    }

    public except<TKey = T>(other: Iterable<T>, keySelector: (item: T) => TKey = identity as any): Query<T> {
        assertIterable(other, 'other');
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        return new Query(except(this._source, other, keySelector));
    }

    public toAsync(): AsyncQuery<T> {
        return AsyncQuery.from(this._source);
    }
}

export function from<T>(source: Iterable<T>): Query<T> {
    return Query.from(source);
}

// JSON helpers
export { fromJson, fromJsonArray, fromJsonObject } from './json/fromJson';
