export function* selectMany<T, U, R = U>(
    source: Iterable<T>,
    collectionSelector: (item: T, index: number) => Iterable<U>,
    resultSelector?: (item: T, collectionItem: U) => R
): Iterable<U | R> {
    let index = 0;
    for (const item of source) {
        for (const collectionItem of collectionSelector(item, index++)) {
            yield resultSelector ? resultSelector(item, collectionItem) : collectionItem;
        }
    }
}
