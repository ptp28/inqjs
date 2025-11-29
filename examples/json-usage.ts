import { fromJson, fromJsonArray, fromJsonObject } from 'inqjs';

console.log('--- JSON Array Example ---');
const jsonArray = '[1, 2, 3, 4, 5, 6]';
const evenNumbers = fromJsonArray<number>(jsonArray)
    .where(x => x % 2 === 0)
    .toArray();
console.log('Even numbers:', evenNumbers);

console.log('\n--- JSON Object Example ---');
const jsonObject = '{"name": "John", "age": 30, "city": "New York"}';
const entries = fromJsonObject(jsonObject)
    .where(([key, value]) => typeof value === 'string')
    .select(([key, value]) => `${key}: ${value}`)
    .toArray();
console.log('String entries:', entries);

console.log('\n--- JSON Array of Objects ---');
const usersJson = `[
    {"id": 1, "name": "Alice", "age": 25, "active": true},
    {"id": 2, "name": "Bob", "age": 30, "active": false},
    {"id": 3, "name": "Charlie", "age": 35, "active": true},
    {"id": 4, "name": "David", "age": 28, "active": true}
]`;

interface User {
    id: number;
    name: string;
    age: number;
    active: boolean;
}

const activeUsers = fromJsonArray<User>(usersJson)
    .where(user => user.active)
    .orderBy(user => user.age)
    .select(user => user.name)
    .toArray();
console.log('Active users (sorted by age):', activeUsers);

const avgAge = fromJsonArray<User>(usersJson)
    .where(user => user.active)
    .sum(user => user.age) / fromJsonArray<User>(usersJson)
        .where(user => user.active)
        .toArray().length;
console.log('Average age of active users:', avgAge);

console.log('\n--- Nested JSON Example ---');
const productsJson = `{
    "electronics": {"laptop": 1200, "phone": 800},
    "books": {"fiction": 15, "science": 25},
    "clothing": {"shirt": 30, "pants": 50}
}`;

const expensiveItems = fromJsonObject<Record<string, number>>(productsJson)
    .select(([category, items]) =>
        fromJson<[string, number]>(JSON.stringify(items))
            .where(([item, price]) => price > 20)
            .select(([item, price]) => ({ category, item, price }))
            .toArray()
    )
    .toArray()
    .flat();
console.log('Expensive items (>$20):', expensiveItems);

console.log('\n--- Generic fromJson Example ---');
const mixedJson = '{"users": [1, 2, 3], "count": 3}';
const result = fromJson(mixedJson)
    .select(([key, value]) => `${key} = ${JSON.stringify(value)}`)
    .toArray();
console.log('Mixed JSON:', result);
