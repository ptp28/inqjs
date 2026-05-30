export async function* joinAsync<TOuter, TInner, TKey, TResult>(
    outer: AsyncIterable<TOuter>,
    inner: Iterable<TInner> | AsyncIterable<TInner>,
    outerKeySelector: (item: TOuter) => TKey | Promise<TKey>,
    innerKeySelector: (item: TInner) => TKey | Promise<TKey>,
    resultSelector: (outer: TOuter, inner: TInner) => TResult | Promise<TResult>
): AsyncIterable<TResult> {
    const lookup = new Map<TKey, TInner[]>();

    for await (const innerItem of inner) {
        const key = await innerKeySelector(innerItem);
        const group = lookup.get(key);
        if (group) {
            group.push(innerItem);
        } else {
            lookup.set(key, [innerItem]);
        }
    }

    for await (const outerItem of outer) {
        const matches = lookup.get(await outerKeySelector(outerItem));
        if (!matches) continue;
        for (const innerItem of matches) {
            yield await resultSelector(outerItem, innerItem);
        }
    }
}
