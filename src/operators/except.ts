export function* except<T, TKey = T>(
    source: Iterable<T>,
    other: Iterable<T>,
    keySelector: (item: T) => TKey = ((x: T) => x) as any
): Iterable<T> {
    const otherKeys = new Set<TKey>();
    for (const item of other) {
        otherKeys.add(keySelector(item));
    }

    const seen = new Set<TKey>();
    for (const item of source) {
        const key = keySelector(item);
        if (!otherKeys.has(key) && !seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }
}
