export async function sumAsync<T>(
    source: AsyncIterable<T>,
    selector: (item: T) => number | Promise<number>
): Promise<number> {
    let total = 0;
    for await (const item of source) {
        const value = await selector(item);
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new TypeError('sumAsync: value must be a finite number.');
        }
        total += value;
    }
    return total;
}
