export async function countAsync<T>(
    source: AsyncIterable<T>,
    predicate?: (item: T) => boolean | Promise<boolean>
): Promise<number> {
    let count = 0;
    for await (const item of source) {
        if (!predicate || await predicate(item)) {
            count++;
        }
    }
    return count;
}
