export async function* selectManyAsync<T, U, R = U>(
    source: AsyncIterable<T>,
    collectionSelector: (item: T, index: number) => Iterable<U> | AsyncIterable<U> | Promise<Iterable<U> | AsyncIterable<U>>,
    resultSelector?: (item: T, collectionItem: U) => R | Promise<R>
): AsyncIterable<U | R> {
    let index = 0;
    for await (const item of source) {
        const collection = await collectionSelector(item, index++);
        for await (const collectionItem of collection) {
            yield resultSelector ? await resultSelector(item, collectionItem) : collectionItem;
        }
    }
}
