export function* select<T, U>(source: Iterable<T>, selector: (item: T, index: number) => U): Iterable<U> {
    let index = 0;
    for (const item of source) {
        yield selector(item, index++);
    }
}
