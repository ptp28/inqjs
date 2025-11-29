export function min<T>(source: Iterable<T>, selector: (item: T) => number): number | undefined {
    let minValue: number | undefined;
    for (const item of source) {
        const value = selector(item);
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new TypeError('min: value must be a finite number.');
        }
        if (minValue === undefined || value < minValue) {
            minValue = value;
        }
    }
    return minValue;
}
