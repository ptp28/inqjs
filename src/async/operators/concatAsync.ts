export async function* concatAsync<T>(source: AsyncIterable<T>, other: AsyncIterable<T>): AsyncIterable<T> {
    yield* source;
    yield* other;
}
