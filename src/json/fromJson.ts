import { Query } from '../Query';

/**
 * Parse a JSON string and return a Query over the result.
 * - If the JSON is an array, returns a Query over the array elements.
 * - If the JSON is an object, returns a Query over the object's entries as [key, value] tuples.
 * - For primitive values, wraps them in a single-element array.
 */
export function fromJson<T = any>(jsonString: string): Query<T> {
    const parsed = JSON.parse(jsonString);

    if (Array.isArray(parsed)) {
        return Query.from(parsed);
    } else if (parsed !== null && typeof parsed === 'object') {
        return Query.from(Object.entries(parsed)) as unknown as Query<T>;
    } else {
        // Primitive value - wrap in array
        return Query.from([parsed]);
    }
}

/**
 * Parse a JSON string as an array and return a Query over its elements.
 * Throws if the JSON is not an array.
 */
export function fromJsonArray<T = any>(jsonString: string): Query<T> {
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
        throw new TypeError('JSON value is not an array');
    }

    return Query.from(parsed);
}

/**
 * Parse a JSON string as an object and return a Query over its entries.
 * Each entry is a [key, value] tuple.
 * Throws if the JSON is not an object.
 */
export function fromJsonObject<T = any>(jsonString: string): Query<[string, T]> {
    const parsed = JSON.parse(jsonString);

    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new TypeError('JSON value is not an object');
    }

    return Query.from(Object.entries(parsed));
}
