export function* concat<T>(source: Iterable<T>, other: Iterable<T>): Iterable<T> {
    yield* source;
    yield* other;
}
