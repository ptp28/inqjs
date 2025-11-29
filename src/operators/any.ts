export function any<T>(source: Iterable<T>, predicate?: (item: T) => boolean): boolean {
    if (predicate) {
        for (const item of source) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    }

    // If no predicate, check if source has any elements
    const iterator = source[Symbol.iterator]();
    return !iterator.next().done;
}
