export function* join<TOuter, TInner, TKey, TResult>(
    outer: Iterable<TOuter>,
    inner: Iterable<TInner>,
    outerKeySelector: (item: TOuter) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (outer: TOuter, inner: TInner) => TResult
): Iterable<TResult> {
    const lookup = new Map<TKey, TInner[]>();

    for (const innerItem of inner) {
        const key = innerKeySelector(innerItem);
        const group = lookup.get(key);
        if (group) {
            group.push(innerItem);
        } else {
            lookup.set(key, [innerItem]);
        }
    }

    for (const outerItem of outer) {
        const matches = lookup.get(outerKeySelector(outerItem));
        if (!matches) continue;
        for (const innerItem of matches) {
            yield resultSelector(outerItem, innerItem);
        }
    }
}
