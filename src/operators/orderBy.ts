export function* orderBy<T, TKey>(
    source: Iterable<T>,
    keySelector: (item: T) => TKey,
    comparer: (a: TKey, b: TKey) => number
): Iterable<T> {
    const buffer = Array.from(source);
    buffer.sort((a, b) => {
        const keyA = keySelector(a);
        const keyB = keySelector(b);
        return comparer(keyA, keyB);
    });

    for (const item of buffer) {
        yield item;
    }
}
