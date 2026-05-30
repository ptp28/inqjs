export interface AsyncSortCriterion<T, TKey = any> {
    keySelector: (item: T) => TKey | Promise<TKey>;
    comparer: (a: TKey, b: TKey) => number;
}

export async function* orderByManyAsync<T>(
    source: AsyncIterable<T>,
    criteria: ReadonlyArray<AsyncSortCriterion<T>>
): AsyncIterable<T> {
    const buffer: T[] = [];
    for await (const item of source) {
        buffer.push(item);
    }

    const itemsWithKeys = await Promise.all(
        buffer.map(async (item) => ({
            item,
            keys: await Promise.all(criteria.map(criterion => criterion.keySelector(item))),
        }))
    );

    itemsWithKeys.sort((a, b) => {
        for (let index = 0; index < criteria.length; index++) {
            const comparison = criteria[index].comparer(a.keys[index], b.keys[index]);
            if (comparison !== 0) return comparison;
        }
        return 0;
    });

    for (const { item } of itemsWithKeys) {
        yield item;
    }
}
