// Pure JavaScript tests (no TypeScript)
// Run with: node tests/query.test.js

const { from, fromJson, fromJsonArray, fromJsonObject } = require('../dist/src/Query');
const { fromAsync } = require('../dist/src/async/AsyncQuery');

// Simple test framework
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.error(`✗ ${name}`);
        console.error(`  ${error.message}`);
        failed++;
    }
}

function assertEquals(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
        throw new Error(`${message || 'Assertion failed'}: expected ${expectedStr}, got ${actualStr}`);
    }
}

function assertTrue(value, message) {
    if (value !== true) {
        throw new Error(`${message || 'Assertion failed'}: expected true, got ${value}`);
    }
}

function assertThrows(fn, message) {
    try {
        fn();
        throw new Error(`${message || 'Expected function to throw'}`);
    } catch (error) {
        // Expected
    }
}

console.log('=== Running JavaScript Tests ===\n');

// Query Tests
console.log('--- Query (Sync) Tests ---');

test('should create from array', () => {
    const result = from([1, 2, 3]).toArray();
    assertEquals(result, [1, 2, 3]);
});

test('should filter with where', () => {
    const result = from([1, 2, 3, 4]).where(x => x % 2 === 0).toArray();
    assertEquals(result, [2, 4]);
});

test('should transform with select', () => {
    const result = from([1, 2, 3]).select(x => x * 2).toArray();
    assertEquals(result, [2, 4, 6]);
});

test('should sort with orderBy', () => {
    const result = from([3, 1, 2]).orderBy().toArray();
    assertEquals(result, [1, 2, 3]);
});

test('should skip elements', () => {
    const result = from([1, 2, 3, 4]).skip(2).toArray();
    assertEquals(result, [3, 4]);
});

test('should take elements', () => {
    const result = from([1, 2, 3, 4, 5]).take(3).toArray();
    assertEquals(result, [1, 2, 3]);
});

test('should remove duplicates with distinct', () => {
    const result = from([1, 2, 2, 3]).distinct().toArray();
    assertEquals(result, [1, 2, 3]);
});

test('should check any', () => {
    const result = from([1, 2, 3]).any(x => x > 2);
    assertTrue(result === true);
});

test('should check all', () => {
    const result = from([1, 2, 3]).all(x => x > 0);
    assertTrue(result === true);
});

test('should sum numbers', () => {
    const result = from([1, 2, 3]).sum();
    assertTrue(result === 6);
});

test('should count elements', () => {
    const result = from([1, 2, 3, 4, 5]).count();
    assertTrue(result === 5);
});

test('should count with predicate', () => {
    const result = from([1, 2, 3, 4, 5]).count(x => x % 2 === 0);
    assertTrue(result === 2);
});

test('should find min', () => {
    const result = from([3, 1, 2]).min();
    assertTrue(result === 1);
});

test('should find max', () => {
    const result = from([1, 3, 2]).max();
    assertTrue(result === 3);
});

test('should get first element', () => {
    const result = from([1, 2, 3]).first();
    assertTrue(result === 1);
});

test('should chain multiple operations', () => {
    const result = from([1, 2, 3, 4, 5, 6])
        .where(x => x % 2 === 0)
        .select(x => x * 2)
        .orderBy(x => x, (a, b) => b - a)
        .take(2)
        .toArray();
    assertEquals(result, [12, 8]);
});

// JSON Tests
console.log('\n--- JSON Query Tests ---');

test('should parse JSON array', () => {
    const json = '[1, 2, 3, 4, 5]';
    const result = fromJsonArray(json)
        .where(x => x % 2 === 0)
        .toArray();
    assertEquals(result, [2, 4]);
});

test('should parse JSON object', () => {
    const json = '{"a": 1, "b": 2, "c": 3}';
    const result = fromJsonObject(json)
        .where(([key, value]) => value > 1)
        .select(([key, value]) => key)
        .toArray();
    assertEquals(result, ['b', 'c']);
});

test('should handle JSON with fromJson', () => {
    const json = '[1, 2, 3]';
    const result = fromJson(json).toArray();
    assertEquals(result, [1, 2, 3]);
});

// Async Tests
console.log('\n--- Async Query Tests ---');

async function runAsyncTests() {
    async function* asyncNumbers() {
        yield 1;
        yield 2;
        yield 3;
    }

    await test('should filter async', async () => {
        const result = await fromAsync(asyncNumbers())
            .where(x => x % 2 !== 0)
            .toArray();
        assertEquals(result, [1, 3]);
    });

    await test('should sum async', async () => {
        const result = await fromAsync(asyncNumbers()).sum();
        assertTrue(result === 6);
    });

    await test('should count async', async () => {
        const result = await fromAsync(asyncNumbers()).count();
        assertTrue(result === 3);
    });

    await test('should take async', async () => {
        const result = await fromAsync(asyncNumbers()).take(2).toArray();
        assertEquals(result, [1, 2]);
    });
}

// Run async tests and print summary
runAsyncTests().then(() => {
    console.log('\n=== Test Summary ===');
    console.log(`✓ Passed: ${passed}`);
    console.log(`✗ Failed: ${failed}`);
    console.log(`Total: ${passed + failed}`);

    if (failed > 0) {
        process.exit(1);
    }
}).catch(error => {
    console.error('Error running async tests:', error);
    process.exit(1);
});
