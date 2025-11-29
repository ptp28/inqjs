export async function* selectAsync<T, U>(
    source: AsyncIterable<T>,
    selector: (item: T, index: number) => U | Promise<U>
): AsyncIterable<U> {
    let index = 0;
    for await (const item of source) {
        yield await selector(item, index++);
    }
}
