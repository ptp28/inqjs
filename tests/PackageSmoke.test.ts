import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const requireFromProject = createRequire(resolve(__dirname, '../package.json'));

describe('package smoke tests', () => {
    it('dist public entrypoint exposes sync, async, and JSON helpers', async () => {
        const entry = requireFromProject('inqjs');

        expect(entry.from([1, 2, 3]).where((x: number) => x > 1).toArray()).toEqual([2, 3]);
        expect(await entry.fromAsync([1, 2, 3]).toArray()).toEqual([1, 2, 3]);
        expect(entry.fromJsonArray('[1, 2]').toArray()).toEqual([1, 2]);
        expect(entry.fromJsonObject('{"a": 1}').toArray()).toEqual([['a', 1]]);
    });

    it('dist subpaths and type declarations are present', () => {
        const asyncEntry = requireFromProject('inqjs/async');
        const jsonEntry = requireFromProject('inqjs/json');

        expect(typeof asyncEntry.fromAsync).toBe('function');
        expect(typeof jsonEntry.fromJson).toBe('function');
        expect(existsSync(resolve(__dirname, '../dist/Query.d.ts'))).toBe(true);
        expect(existsSync(resolve(__dirname, '../dist/async/AsyncQuery.d.ts'))).toBe(true);
        expect(existsSync(resolve(__dirname, '../dist/json/fromJson.d.ts'))).toBe(true);
    });
});
