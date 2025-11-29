export function* where<T>(source: Iterable<T>, predicate: (item: T, index: number) => boolean): Iterable<T> {
    let index = 0;
    for (const item of source) {
        if (predicate(item, index++)) {
            yield item;
        }
    }
}
