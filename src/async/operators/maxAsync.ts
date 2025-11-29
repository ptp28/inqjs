export async function maxAsync<T>(
    source: AsyncIterable<T>,
    selector: (item: T) => number | Promise<number>
): Promise<number | undefined> {
    let maxValue: number | undefined;
    for await (const item of source) {
        const value = await selector(item);
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new TypeError('maxAsync: value must be a finite number.');
        }
        if (maxValue === undefined || value > maxValue) {
            maxValue = value;
        }
    }
    return maxValue;
}
