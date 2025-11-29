export function* append<T>(source: Iterable<T>, element: T): Iterable<T> {
    yield* source;
    yield element;
}
