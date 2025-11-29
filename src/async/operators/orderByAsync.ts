export async function* orderByAsync<T, TKey>(
    source: AsyncIterable<T>,
    keySelector: (item: T) => TKey | Promise<TKey>,
    comparer: (a: TKey, b: TKey) => number
): AsyncIterable<T> {
    const buffer: T[] = [];
    for await (const item of source) {
        buffer.push(item);
    }

    // We need to resolve keys for all items to sort them
    const itemsWithKeys = await Promise.all(
        buffer.map(async (item) => ({
            item,
            key: await keySelector(item),
        }))
    );

    itemsWithKeys.sort((a, b) => comparer(a.key, b.key));

    for (const { item } of itemsWithKeys) {
        yield item;
    }
}
