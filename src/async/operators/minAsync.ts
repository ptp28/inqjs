export async function minAsync<T>(
    source: AsyncIterable<T>,
    selector: (item: T) => number | Promise<number>
): Promise<number | undefined> {
    let minValue: number | undefined;
    for await (const item of source) {
        const value = await selector(item);
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new TypeError('minAsync: value must be a finite number.');
        }
        if (minValue === undefined || value < minValue) {
            minValue = value;
        }
    }
    return minValue;
}
