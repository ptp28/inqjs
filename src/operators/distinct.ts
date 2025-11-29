export function* distinct<T, TKey>(source: Iterable<T>, keySelector: (item: T) => TKey): Iterable<T> {
    const seen = new Set<TKey>();
    for (const item of source) {
        const key = keySelector(item);
        if (!seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }
}
