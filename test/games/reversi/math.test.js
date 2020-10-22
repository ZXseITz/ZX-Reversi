const {describe, test} = require("@jest/globals")
const math = require('../../../src/games/reversi/math');

describe('test is in range', () => {
    test('default', () => {
        expect(math.isInRange(4)).toBeTruthy();
        expect(math.isInRange(0)).toBeTruthy();
        expect(math.isInRange(7)).toBeTruthy();
        expect(math.isInRange(-1)).toBeFalsy();
        expect(math.isInRange(8)).toBeFalsy();
    });

    test('custom', () => {
        expect(math.isInRange(5, -2, 10)).toBeTruthy();
        expect(math.isInRange(-2, -2, 10)).toBeTruthy();
        expect(math.isInRange(10, -2, 10)).toBeTruthy();
        expect(math.isInRange(-3, -2, 10)).toBeFalsy();
        expect(math.isInRange(11, -2, 10)).toBeFalsy();
    });
});

describe('test index', () => {
    test('default', () => {
        expect(math.index({x: 5, y: 3})).toEqual(29);
    });

    test('custom', () => {
        expect(math.index({x: 1, y: 3}, 5)).toEqual(16);
    });
});