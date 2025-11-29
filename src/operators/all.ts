export function all<T>(source: Iterable<T>, predicate: (item: T) => boolean): boolean {
    for (const item of source) {
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
}
