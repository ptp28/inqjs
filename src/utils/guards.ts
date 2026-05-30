export function isIterable<T>(obj: any): obj is Iterable<T> {
    return obj != null && typeof obj[Symbol.iterator] === 'function';
}

export function isAsyncIterable<T>(obj: any): obj is AsyncIterable<T> {
    return obj != null && typeof obj[Symbol.asyncIterator] === 'function';
}

export function isIterableLike<T>(obj: any): obj is Iterable<T> | AsyncIterable<T> {
    return isIterable(obj) || isAsyncIterable(obj);
}

export function isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

export function assertIterable<T>(source: any, name: string = 'source'): asserts source is Iterable<T> {
    if (!isIterable(source)) {
        throw new TypeError(`${name} must be an iterable.`);
    }
}

export function assertIterableLike<T>(source: any, name: string = 'source'): asserts source is Iterable<T> | AsyncIterable<T> {
    if (!isIterableLike(source)) {
        throw new TypeError(`${name} must be an iterable or async iterable.`);
    }
}

export function assertFunction(fn: any, name: string): asserts fn is Function {
    if (!isFunction(fn)) {
        throw new TypeError(`${name} must be a function.`);
    }
}

export function assertInteger(num: any, name: string): asserts num is number {
    if (typeof num !== 'number' || !Number.isFinite(num) || !Number.isInteger(num)) {
        throw new TypeError(`${name} must be a finite integer.`);
    }
}

export function assertNonNegative(num: number, name: string): void {
    if (num < 0) {
        throw new TypeError(`${name} must be non-negative.`);
    }
}
