export async function* distinctAsync<T, TKey>(
    source: AsyncIterable<T>,
    keySelector: (item: T) => TKey | Promise<TKey>
): AsyncIterable<T> {
    const seen = new Set<TKey>();
    for await (const item of source) {
        const key = await keySelector(item);
        if (!seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }
}
