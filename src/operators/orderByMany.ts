export interface SortCriterion<T, TKey = any> {
    keySelector: (item: T) => TKey;
    comparer: (a: TKey, b: TKey) => number;
}

export function* orderByMany<T>(
    source: Iterable<T>,
    criteria: ReadonlyArray<SortCriterion<T>>
): Iterable<T> {
    const buffer = Array.from(source);
    buffer.sort((a, b) => {
        for (const criterion of criteria) {
            const comparison = criterion.comparer(criterion.keySelector(a), criterion.keySelector(b));
            if (comparison !== 0) return comparison;
        }
        return 0;
    });

    for (const item of buffer) {
        yield item;
    }
}
