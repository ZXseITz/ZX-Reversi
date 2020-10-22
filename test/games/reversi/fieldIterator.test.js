const {describe, test, beforeEach} = require("@jest/globals")
const {FieldIterator, isOnBoard} = require("../../../src/games/reversi/fieldIterator");

describe('test is on board', () => {
    test('center', () => {
        expect(isOnBoard({x: 5, y: 4})).toBeTruthy();
    });
    test('right top corner', () => {
        expect(isOnBoard({x: 7, y: 0})).toBeTruthy();
    });
    test('left top corner', () => {
        expect(isOnBoard({x: 0, y: 0})).toBeTruthy();
    });
    test('left bottom corner', () => {
        expect(isOnBoard({x: 0, y: 7})).toBeTruthy();
    });
    test('right bottom corner', () => {
        expect(isOnBoard({x: 7, y: 7})).toBeTruthy();
    });
    test('right outside', () => {
        expect(isOnBoard({x: 8, y: 4})).toBeFalsy();
    });
    test('top outside', () => {
        expect(isOnBoard({x: 3, y: -1})).toBeFalsy();
    });
    test('left outside', () => {
        expect(isOnBoard({x: -1, y: 3})).toBeFalsy();
    });
    test('bottom outside', () => {
        expect(isOnBoard({x: 4, y: 8})).toBeFalsy();
    });
});


describe('test field iterator', () => {
    let it;
    beforeEach(() => {
        it = new FieldIterator({
            fields: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ]
        }, {x: 1, y: 0});
    })
    test('constructor', () => {
        expect(it.dir).toEqual({x: 1, y: 0});
        expect(it.point).toBeUndefined();
    });
    test('set outside', () => {
        it.set({x: -1, y: 2});
        expect(it.point).toBeUndefined();
    });
    test('set inside', () => {
        it.set({x: 3, y: 2});
        expect(it.point).toEqual({x: 3, y: 2});
    });
    test('next undefined', () => {
        expect(it.next()).toEqual(-1);
    });
    test('next outside', () => {
        it.set({x: -1, y: 2});
        expect(it.next()).toEqual(-1);
    });
    test('next left edge', () => {
        it.set({x: 0, y: 3});
        expect(it.next()).toEqual(0);
        expect(it.next()).toEqual(0);
        expect(it.next()).toEqual(1);
        expect(it.next()).toEqual(2);
        expect(it.next()).toEqual(0);
        expect(it.next()).toEqual(0);
        expect(it.next()).toEqual(0);
        expect(it.next()).toEqual(-1);
        expect(it.point).toBeUndefined();
    });
});
