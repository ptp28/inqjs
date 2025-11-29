export async function* exceptAsync<T, TKey = T>(
    source: AsyncIterable<T>,
    other: AsyncIterable<T>,
    keySelector: (item: T) => TKey | Promise<TKey> = ((x: T) => x) as any
): AsyncIterable<T> {
    const otherKeys = new Set<TKey>();
    for await (const item of other) {
        otherKeys.add(await keySelector(item));
    }

    const seen = new Set<TKey>();
    for await (const item of source) {
        const key = await keySelector(item);
        if (!otherKeys.has(key) && !seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }
}
