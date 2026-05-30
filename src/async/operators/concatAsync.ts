export async function* concatAsync<T>(
    source: AsyncIterable<T>,
    other: Iterable<T> | AsyncIterable<T>
): AsyncIterable<T> {
    yield* source;
    yield* other;
}
