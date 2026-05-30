# inqjs (Integrated Query for JavaScript)

[![npm version](https://badge.fury.io/js/inqjs.svg)](https://www.npmjs.com/package/inqjs)
[![npm downloads](https://img.shields.io/npm/dm/inqjs.svg)](https://www.npmjs.com/package/inqjs)
[![license](https://img.shields.io/npm/l/inqjs.svg)](https://github.com/ptp28/inqjs/blob/main/LICENSE)

A lightweight, dependency-free LINQ engine for TypeScript and JavaScript with comprehensive query capabilities.

> **Note**: This project was developed with heavy assistance from AI (Google Gemini), demonstrating modern AI-powered software development workflows.

## Features

✨ **Comprehensive LINQ Operations**
- Filtering: `where`, `distinct`
- Projection: `select`, `selectMany`
- Ordering: `orderBy`, `thenBy`
- Partitioning: `skip`, `take`
- Aggregation: `sum`, `min`, `max`, `count`
- Quantifiers: `any`, `all`
- Element: `first`
- Set Operations: `union`, `intersect`, `except`
- Sequence: `append`, `prepend`, `concat`
- Grouping & Joining: `groupBy`, `join`

🚀 **Lazy Evaluation**
- Operators are lazily evaluated using generators
- Only materializes when calling terminal operators like `toArray()`

⚡ **Async Support**
- Full async/await support with `AsyncQuery`
- Works with `Iterable<T>` and `AsyncIterable<T>`

📦 **JSON Querying**
- Query JSON data directly with `fromJson`, `fromJsonArray`, `fromJsonObject`

🔒 **Type Safe**
- Written in TypeScript with `strict: true`
- Full type inference and safety

🎯 **Zero Dependencies**
- No external runtime dependencies
- Works with any `Iterable<T>` (Arrays, Sets, Maps, Generators)

## Installation

```bash
npm install inqjs
```

## Imports

```typescript
import { from, fromAsync, fromJsonArray } from 'inqjs';
import { fromAsync as fromAsyncOnly } from 'inqjs/async';
import { fromJson } from 'inqjs/json';
```

CommonJS is supported too:

```javascript
const { from, fromAsync } = require('inqjs');
```

## Quick Start

### Basic Query (Sync)

```typescript
import { from } from 'inqjs';

const numbers = [1, 2, 3, 4, 5, 6];

const result = from(numbers)
  .where(x => x % 2 === 0)
  .select(x => x * x)
  .orderBy()
  .toArray();

console.log(result); // [4, 16, 36]
```

### Async Query

```typescript
import { fromAsync } from 'inqjs';

async function* asyncNumbers() {
  yield 1; yield 2; yield 3;
}

const result = await fromAsync(asyncNumbers())
  .where(async x => x > 1)
  .select(async x => x * 2)
  .toArray();

console.log(result); // [4, 6]
```

### JSON Querying

```typescript
import { fromJsonArray } from 'inqjs';

const json = '[{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]';

const adults = fromJsonArray(json)
  .where(user => user.age >= 18)
  .select(user => user.name)
  .toArray();

console.log(adults); // ['Alice', 'Bob']
```

### Set Operations

```typescript
import { from } from 'inqjs';

const list1 = [1, 2, 3, 4];
const list2 = [3, 4, 5, 6];

// Union
from(list1).union(list2).toArray();
// => [1, 2, 3, 4, 5, 6]

// Intersect
from(list1).intersect(list2).toArray();
// => [3, 4]

// Except
from(list1).except(list2).toArray();
// => [1, 2]
```

## API Reference

### Query Creation

- `from(iterable)` - Create query from any iterable
- `fromAsync(iterableOrAsyncIterable)` - Create async query
- `fromJson(jsonString)` - Parse and query JSON
- `fromJsonArray(jsonString)` - Parse JSON array
- `fromJsonObject(jsonString)` - Parse JSON object

### Filtering & Projection

- `where(predicate)` - Filter elements
- `select(selector)` - Transform elements
- `selectMany(collectionSelector, resultSelector?)` - Project and flatten nested sequences
- `distinct(keySelector?)` - Remove duplicates

### Ordering & Partitioning

- `orderBy(keySelector?, comparer?)` - Sort elements
- `thenBy(keySelector?, comparer?)` - Add a secondary sort after `orderBy`
- `skip(count)` - Skip first N elements
- `take(count)` - Take first N elements

### Grouping & Joining

- `groupBy(keySelector, elementSelector?)` - Group elements by key
- `join(inner, outerKeySelector, innerKeySelector, resultSelector)` - Inner join two sequences by matching keys

### Aggregation

- `sum(selector?)` - Sum numeric values
- `min(selector?)` - Find minimum
- `max(selector?)` - Find maximum
- `count(predicate?)` - Count elements

### Quantifiers

- `any(predicate?)` - Check if any match
- `all(predicate)` - Check if all match

### Element Access

- `first(predicate?)` - Get first element

### Set Operations

- `union(other, keySelector?)` - Set union
- `intersect(other, keySelector?)` - Set intersection
- `except(other, keySelector?)` - Set difference

### Sequence Operations

- `append(element)` - Add element to end
- `prepend(element)` - Add element to start
- `concat(other)` - Concatenate sequences

### Terminal Operations

- `toArray()` - Materialize to array
- `toAsync()` - Convert to async query

## Testing

```bash
# Build, run TypeScript tests, and run JavaScript smoke tests
npm test

# Run just the JavaScript smoke tests
npm run test:js
```

**Test Coverage**: TypeScript unit/package smoke tests plus pure JavaScript consumer smoke tests.

## Examples

See the `examples/` directory for more usage examples:
- `examples/usage.ts` - Basic LINQ operations
- `examples/json-usage.ts` - JSON querying examples

## Architecture

- **Lazy Evaluation**: Uses generator functions for deferred execution
- **Immutable**: Each operation returns a new `Query` instance
- **Type Safe**: Full TypeScript support with strict mode
- **Modular**: Operators are separate modules in `src/operators/`

## Limitations

- `orderBy` materializes the sequence (requires full iteration to sort)
- Set operations (`union`, `intersect`, `except`) store keys in memory; `intersect` and `except` read the second sequence before yielding results
- Equality uses JavaScript `Set` semantics on each value or selected key; object values compare by reference unless you provide a `keySelector`
- Generator-backed queries keep the source's natural behavior, so a one-shot generator can only be consumed once
- `groupBy` and `join` materialize lookup data before yielding results

## Development

This project was developed using AI-assisted coding with Google Gemini, showcasing:
- Rapid prototyping and iteration
- Comprehensive test coverage generation
- Documentation and example creation
- Code refactoring and optimization

The AI helped with:
- Initial architecture design
- Operator implementations (sync and async)
- Test suite creation and organization
- JSON querying capabilities
- Set operations implementation
- Documentation and examples

## License

MIT

## Contributing

Contributions are welcome! This project demonstrates how AI can accelerate development while maintaining code quality through comprehensive testing.
