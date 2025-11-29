export async function anyAsync<T>(
    source: AsyncIterable<T>,
    predicate?: (item: T) => boolean | Promise<boolean>
): Promise<boolean> {
    if (predicate) {
        for await (const item of source) {
            if (await predicate(item)) {
                return true;
            }
        }
        return false;
    }

    // If no predicate, check if source has any elements
    const iterator = source[Symbol.asyncIterator]();
    const result = await iterator.next();
    return !result.done;
}
