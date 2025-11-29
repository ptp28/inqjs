export async function* unionAsync<T, TKey = T>(
    source: AsyncIterable<T>,
    other: AsyncIterable<T>,
    keySelector: (item: T) => TKey | Promise<TKey> = ((x: T) => x) as any
): AsyncIterable<T> {
    const seen = new Set<TKey>();

    for await (const item of source) {
        const key = await keySelector(item);
        if (!seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }

    for await (const item of other) {
        const key = await keySelector(item);
        if (!seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }
}
