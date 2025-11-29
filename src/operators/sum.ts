export function sum<T>(source: Iterable<T>, selector: (item: T) => number): number {
    let total = 0;
    for (const item of source) {
        const value = selector(item);
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new TypeError('sum: value must be a finite number.');
        }
        total += value;
    }
    return total;
}
