import { from } from 'inqjs';
import { fromAsync } from 'inqjs';

async function main() {
    console.log('--- Array Example ---');
    const numbers = [1, 2, 3, 4, 5, 6];
    const evenSquares = from(numbers)
        .where(x => x % 2 === 0)
        .select(x => x * x)
        .toArray();
    console.log('Even squares:', evenSquares);

    console.log('\n--- Set Example (Distinct) ---');
    const duplicates = [1, 2, 2, 3, 3, 3, 4];
    const distinctValues = from(duplicates).distinct().toArray();
    console.log('Distinct values:', distinctValues);

    console.log('\n--- Map Example ---');
    const map = new Map<string, number>([
        ['a', 1],
        ['b', 2],
        ['c', 3],
    ]);
    const mapEntries = from(map)
        .where(([key, val]) => val > 1)
        .select(([key, val]) => `${key}:${val}`)
        .toArray();
    console.log('Map entries > 1:', mapEntries);

    console.log('\n--- Generator Example ---');
    function* range(start: number, count: number) {
        for (let i = 0; i < count; i++) {
            yield start + i;
        }
    }
    const largeSeq = from(range(1, 100))
        .skip(90)
        .where(x => x % 2 === 0)
        .toArray();
    console.log('Last even numbers:', largeSeq);

    console.log('\n--- Async Example ---');
    async function* asyncRange(start: number, count: number) {
        for (let i = 0; i < count; i++) {
            await new Promise(resolve => setTimeout(resolve, 10));
            yield start + i;
        }
    }

    const asyncResult = await fromAsync(asyncRange(1, 10))
        .where(async x => x % 2 !== 0)
        .select(async x => x * 2)
        .toArray();
    console.log('Async odd doubled:', asyncResult);

    const asyncAny = await fromAsync(asyncRange(1, 5)).any(x => x > 3);
    console.log('Async any > 3:', asyncAny);
}

main().catch(console.error);
