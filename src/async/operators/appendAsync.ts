export async function* appendAsync<T>(source: AsyncIterable<T>, element: T): AsyncIterable<T> {
    yield* source;
    yield element;
}
