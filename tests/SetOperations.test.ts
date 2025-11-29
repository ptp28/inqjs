import { describe, it, expect } from 'vitest';
import { from } from '../src/Query';

describe('Sequence Operations', () => {
    describe('append', () => {
        it('should append element to end', () => {
            const result = from([1, 2, 3]).append(4).toArray();
            expect(result).toEqual([1, 2, 3, 4]);
        });

        it('should append to empty sequence', () => {
            const result = from([]).append(1).toArray();
            expect(result).toEqual([1]);
        });
    });

    describe('prepend', () => {
        it('should prepend element to start', () => {
            const result = from([2, 3, 4]).prepend(1).toArray();
            expect(result).toEqual([1, 2, 3, 4]);
        });

        it('should prepend to empty sequence', () => {
            const result = from([]).prepend(1).toArray();
            expect(result).toEqual([1]);
        });
    });

    describe('concat', () => {
        it('should concatenate two sequences', () => {
            const result = from([1, 2]).concat([3, 4]).toArray();
            expect(result).toEqual([1, 2, 3, 4]);
        });

        it('should handle empty sequences', () => {
            expect(from([1, 2]).concat([]).toArray()).toEqual([1, 2]);
            expect(from([]).concat([3, 4]).toArray()).toEqual([3, 4]);
        });
    });
});

describe('Set Operations', () => {
    describe('union', () => {
        it('should return unique elements from both sequences', () => {
            const result = from([1, 2, 3]).union([3, 4, 5]).toArray();
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });

        it('should use key selector', () => {
            const list1 = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
            const list2 = [{ id: 2, name: 'c' }, { id: 3, name: 'd' }];
            const result = from(list1).union(list2, x => x.id).toArray();
            expect(result).toEqual([
                { id: 1, name: 'a' },
                { id: 2, name: 'b' },
                { id: 3, name: 'd' }
            ]);
        });

        it('should handle empty sequences', () => {
            expect(from([1, 2]).union([]).toArray()).toEqual([1, 2]);
            expect(from([]).union([3, 4]).toArray()).toEqual([3, 4]);
        });
    });

    describe('intersect', () => {
        it('should return common elements', () => {
            const result = from([1, 2, 3, 4]).intersect([3, 4, 5, 6]).toArray();
            expect(result).toEqual([3, 4]);
        });

        it('should use key selector', () => {
            const list1 = [{ id: 1, val: 'a' }, { id: 2, val: 'b' }, { id: 3, val: 'c' }];
            const list2 = [{ id: 2, val: 'x' }, { id: 3, val: 'y' }];
            const result = from(list1).intersect(list2, x => x.id).toArray();
            expect(result).toEqual([
                { id: 2, val: 'b' },
                { id: 3, val: 'c' }
            ]);
        });

        it('should return empty for no common elements', () => {
            const result = from([1, 2]).intersect([3, 4]).toArray();
            expect(result).toEqual([]);
        });
    });

    describe('except', () => {
        it('should return elements not in second sequence', () => {
            const result = from([1, 2, 3, 4]).except([3, 4, 5, 6]).toArray();
            expect(result).toEqual([1, 2]);
        });

        it('should use key selector', () => {
            const list1 = [{ id: 1, val: 'a' }, { id: 2, val: 'b' }, { id: 3, val: 'c' }];
            const list2 = [{ id: 2, val: 'x' }, { id: 3, val: 'y' }];
            const result = from(list1).except(list2, x => x.id).toArray();
            expect(result).toEqual([{ id: 1, val: 'a' }]);
        });

        it('should return all elements if no overlap', () => {
            const result = from([1, 2]).except([3, 4]).toArray();
            expect(result).toEqual([1, 2]);
        });

        it('should return empty if all elements excluded', () => {
            const result = from([1, 2]).except([1, 2, 3]).toArray();
            expect(result).toEqual([]);
        });
    });
});
