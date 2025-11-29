export async function* takeAsync<T>(source: AsyncIterable<T>, count: number): AsyncIterable<T> {
    let taken = 0;
    for await (const item of source) {
        if (taken >= count) break;
        yield item;
        taken++;
    }
}
