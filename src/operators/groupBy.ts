export class Grouping<TKey, TElement> implements Iterable<TElement> {
    constructor(
        public readonly key: TKey,
        public readonly values: TElement[]
    ) {}

    public [Symbol.iterator](): Iterator<TElement> {
        return this.values[Symbol.iterator]();
    }
}

export function* groupBy<T, TKey, TElement = T>(
    source: Iterable<T>,
    keySelector: (item: T) => TKey,
    elementSelector: (item: T) => TElement = ((item: T) => item as unknown as TElement)
): Iterable<Grouping<TKey, TElement>> {
    const groups = new Map<TKey, TElement[]>();

    for (const item of source) {
        const key = keySelector(item);
        const group = groups.get(key);
        if (group) {
            group.push(elementSelector(item));
        } else {
            groups.set(key, [elementSelector(item)]);
        }
    }

    for (const [key, values] of groups) {
        yield new Grouping(key, values);
    }
}
