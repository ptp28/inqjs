export async function firstAsync<T>(
    source: AsyncIterable<T>,
    predicate?: (item: T) => boolean | Promise<boolean>
): Promise<T> {
    if (predicate) {
        for await (const item of source) {
            if (await predicate(item)) {
                return item;
            }
        }
    } else {
        const iterator = source[Symbol.asyncIterator]();
        const result = await iterator.next();
        if (!result.done) {
            return result.value;
        }
    }
    throw new Error('Sequence contains no matching element.');
}
