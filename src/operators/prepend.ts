export function* prepend<T>(source: Iterable<T>, element: T): Iterable<T> {
    yield element;
    yield* source;
}
