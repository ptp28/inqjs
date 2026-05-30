import { Grouping } from '../../operators/groupBy';

export async function* groupByAsync<T, TKey, TElement = T>(
    source: AsyncIterable<T>,
    keySelector: (item: T) => TKey | Promise<TKey>,
    elementSelector: (item: T) => TElement | Promise<TElement> = ((item: T) => item as unknown as TElement)
): AsyncIterable<Grouping<TKey, TElement>> {
    const groups = new Map<TKey, TElement[]>();

    for await (const item of source) {
        const key = await keySelector(item);
        const element = await elementSelector(item);
        const group = groups.get(key);
        if (group) {
            group.push(element);
        } else {
            groups.set(key, [element]);
        }
    }

    for (const [key, values] of groups) {
        yield new Grouping(key, values);
    }
}
