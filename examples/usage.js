"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("../src/Query");
const AsyncQuery_1 = require("../src/async/AsyncQuery");
async function main() {
    console.log('--- Array Example ---');
    const numbers = [1, 2, 3, 4, 5, 6];
    const evenSquares = (0, Query_1.from)(numbers)
        .where(x => x % 2 === 0)
        .select(x => x * x)
        .toArray();
    console.log('Even squares:', evenSquares);
    console.log('\n--- Set Example (Distinct) ---');
    const duplicates = [1, 2, 2, 3, 3, 3, 4];
    const distinctValues = (0, Query_1.from)(duplicates).distinct().toArray();
    console.log('Distinct values:', distinctValues);
    console.log('\n--- Map Example ---');
    const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
    ]);
    const mapEntries = (0, Query_1.from)(map)
        .where(([key, val]) => val > 1)
        .select(([key, val]) => `${key}:${val}`)
        .toArray();
    console.log('Map entries > 1:', mapEntries);
    console.log('\n--- Generator Example ---');
    function* range(start, count) {
        for (let i = 0; i < count; i++) {
            yield start + i;
        }
    }
    const largeSeq = (0, Query_1.from)(range(1, 100))
        .skip(90)
        .where(x => x % 2 === 0)
        .toArray();
    console.log('Last even numbers:', largeSeq);
    console.log('\n--- Async Example ---');
    async function* asyncRange(start, count) {
        for (let i = 0; i < count; i++) {
            await new Promise(resolve => setTimeout(resolve, 10));
            yield start + i;
        }
    }
    const asyncResult = await (0, AsyncQuery_1.fromAsync)(asyncRange(1, 10))
        .where(async (x) => x % 2 !== 0)
        .select(async (x) => x * 2)
        .toArray();
    console.log('Async odd doubled:', asyncResult);
    const asyncAny = await (0, AsyncQuery_1.fromAsync)(asyncRange(1, 5)).any(x => x > 3);
    console.log('Async any > 3:', asyncAny);
}
main().catch(console.error);
