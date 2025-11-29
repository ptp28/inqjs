export function first<T>(source: Iterable<T>, predicate?: (item: T) => boolean): T {
    if (predicate) {
        for (const item of source) {
            if (predicate(item)) {
                return item;
            }
        }
    } else {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        if (!result.done) {
            return result.value;
        }
    }
    throw new Error('Sequence contains no matching element.');
}
