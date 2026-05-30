import { assertIterable, assertFunction, assertInteger, assertNonNegative } from './utils/guards';
import { defaultComparer, identity } from './utils/comparers';
import { where } from './operators/where';
import { select } from './operators/select';
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
import { groupBy, Grouping } from './operators/groupBy';
import { join } from './operators/join';
import { selectMany } from './operators/selectMany';
import { orderByMany, SortCriterion } from './operators/orderByMany';
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
    ): OrderedQuery<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        if (comparer !== undefined) assertFunction(comparer, 'comparer');
        return new OrderedQuery(this._source, [{ keySelector, comparer }]);
    }

    public groupBy<TKey, TElement = T>(
        keySelector: (item: T) => TKey,
        elementSelector: (item: T) => TElement = identity as any
    ): Query<Grouping<TKey, TElement>> {
        assertFunction(keySelector, 'keySelector');
        if (elementSelector !== undefined) assertFunction(elementSelector, 'elementSelector');
        return new Query(groupBy(this._source, keySelector, elementSelector));
    }

    public join<TInner, TKey, TResult>(
        inner: Iterable<TInner>,
        outerKeySelector: (item: T) => TKey,
        innerKeySelector: (item: TInner) => TKey,
        resultSelector: (outer: T, inner: TInner) => TResult
    ): Query<TResult> {
        assertIterable(inner, 'inner');
        assertFunction(outerKeySelector, 'outerKeySelector');
        assertFunction(innerKeySelector, 'innerKeySelector');
        assertFunction(resultSelector, 'resultSelector');
        return new Query(join(this._source, inner, outerKeySelector, innerKeySelector, resultSelector));
    }

    public selectMany<U>(
        collectionSelector: (item: T, index?: number) => Iterable<U>
    ): Query<U>;
    public selectMany<U, R>(
        collectionSelector: (item: T, index?: number) => Iterable<U>,
        resultSelector: (item: T, collectionItem: U) => R
    ): Query<R>;
    public selectMany<U, R = U>(
        collectionSelector: (item: T, index?: number) => Iterable<U>,
        resultSelector?: (item: T, collectionItem: U) => R
    ): Query<U | R> {
        assertFunction(collectionSelector, 'collectionSelector');
        if (resultSelector !== undefined) assertFunction(resultSelector, 'resultSelector');
        return new Query(selectMany(this._source, collectionSelector, resultSelector));
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

export class OrderedQuery<T> extends Query<T> {
    constructor(
        private readonly _orderedSource: Iterable<T>,
        private readonly _criteria: ReadonlyArray<SortCriterion<T>>
    ) {
        super(orderByMany(_orderedSource, _criteria));
    }

    public thenBy<TKey = T>(
        keySelector: (item: T) => TKey = identity as any,
        comparer: (a: TKey, b: TKey) => number = defaultComparer
    ): OrderedQuery<T> {
        if (keySelector !== undefined) assertFunction(keySelector, 'keySelector');
        if (comparer !== undefined) assertFunction(comparer, 'comparer');
        return new OrderedQuery(this._orderedSource, [...this._criteria, { keySelector, comparer }]);
    }
}

export function from<T>(source: Iterable<T>): Query<T> {
    return Query.from(source);
}

// JSON helpers
export { fromJson, fromJsonArray, fromJsonObject } from './json/fromJson';
export { fromAsync } from './async/AsyncQuery';
export { Grouping } from './operators/groupBy';
