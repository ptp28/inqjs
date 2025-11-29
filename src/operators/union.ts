export function* union<T, TKey = T>(
    source: Iterable<T>,
    other: Iterable<T>,
    keySelector: (item: T) => TKey = ((x: T) => x) as any
): Iterable<T> {
    const seen = new Set<TKey>();

    for (const item of source) {
        const key = keySelector(item);
        if (!seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }

    for (const item of other) {
        const key = keySelector(item);
        if (!seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }
}
