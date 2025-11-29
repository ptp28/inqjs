export async function toArrayAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const item of source) {
        result.push(item);
    }
    return result;
}
