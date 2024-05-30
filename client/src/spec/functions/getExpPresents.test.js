import { getExpPersents } from '../../helpers/getExpPersents';

describe('getExpPersents', () => {
    test('return 0 if gamer_exp is 0', () => {
        expect(getExpPersents(0, 1)).toBe(0);
    });

    test('correct percent when gamer_exp and next_rank are positive', () => {
        expect(getExpPersents(50, 50)).toBe(0.5);
    });

    test('1 if percent is more than 1 or equal to 1', () => {
        expect(getExpPersents(100, 0)).toBe(1);
    });

    test('should return a value less than 1 if percent is less than 1', () => {
        expect(getExpPersents(25, 75)).toBeCloseTo(0.25);
        expect(getExpPersents(40, 60)).toBeCloseTo(0.4);
    });

    test('should handle default values correctly', () => {
        expect(getExpPersents()).toBe(0);
        expect(getExpPersents(10)).toBeCloseTo(10 / 11);
    });
});
