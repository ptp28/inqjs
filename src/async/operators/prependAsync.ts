export async function* prependAsync<T>(source: AsyncIterable<T>, element: T): AsyncIterable<T> {
    yield element;
    yield* source;
}
