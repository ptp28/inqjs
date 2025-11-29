export function max<T>(source: Iterable<T>, selector: (item: T) => number): number | undefined {
    let maxValue: number | undefined;
    for (const item of source) {
        const value = selector(item);
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new TypeError('max: value must be a finite number.');
        }
        if (maxValue === undefined || value > maxValue) {
            maxValue = value;
        }
    }
    return maxValue;
}
