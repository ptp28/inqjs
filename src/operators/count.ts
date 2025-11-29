export function count<T>(source: Iterable<T>, predicate?: (item: T) => boolean): number {
    let count = 0;
    for (const item of source) {
        if (!predicate || predicate(item)) {
            count++;
        }
    }
    return count;
}
