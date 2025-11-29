export async function* skipAsync<T>(source: AsyncIterable<T>, count: number): AsyncIterable<T> {
    let skipped = 0;
    for await (const item of source) {
        if (skipped < count) {
            skipped++;
            continue;
        }
        yield item;
    }
}
