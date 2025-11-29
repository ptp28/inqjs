# Examples

These examples demonstrate how to use `inqjs` after it's published to npm.

## Running Examples

**Note**: These examples import from `'inqjs'`, which requires the package to be published to npm first.

### For Development (Before Publishing)

If you want to run these examples locally before publishing, you can:

1. Build the project:
   ```bash
   npm run build
   ```

2. Link the package locally:
   ```bash
   npm link
   ```

3. In the examples directory, link to the local package:
   ```bash
   npm link inqjs
   ```

### After Publishing

Once published to npm, you can run these examples directly:

```bash
npm install inqjs
npx tsx examples/usage.ts
npx tsx examples/json-usage.ts
```

## Examples

- **usage.ts** - Demonstrates basic LINQ operations (sync and async)
- **json-usage.ts** - Shows JSON querying capabilities
