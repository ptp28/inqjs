export function* take<T>(source: Iterable<T>, count: number): Iterable<T> {
    let taken = 0;
    for (const item of source) {
        if (taken >= count) break;
        yield item;
        taken++;
    }
}
