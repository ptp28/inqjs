export async function* whereAsync<T>(
    source: AsyncIterable<T>,
    predicate: (item: T, index: number) => boolean | Promise<boolean>
): AsyncIterable<T> {
    let index = 0;
    for await (const item of source) {
        if (await predicate(item, index++)) {
            yield item;
        }
    }
}
