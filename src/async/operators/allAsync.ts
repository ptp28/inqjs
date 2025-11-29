export async function allAsync<T>(
    source: AsyncIterable<T>,
    predicate: (item: T) => boolean | Promise<boolean>
): Promise<boolean> {
    for await (const item of source) {
        if (!(await predicate(item))) {
            return false;
        }
    }
    return true;
}
