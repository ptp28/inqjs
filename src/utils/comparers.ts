export function defaultComparer<T>(a: T, b: T): number {
    if (a === b) return 0;
    if (a === null || a === undefined) return -1;
    if (b === null || b === undefined) return 1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

export function identity<T>(item: T): T {
    return item;
}
