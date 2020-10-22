const {describe, test, beforeEach} = require("@jest/globals")
const {Board} = require('../../../src/games/reversi/board');

describe('test board', () => {
    test('constructor', () => {
        const board = new Board()
        expect(board.data).toEqual([
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 2, 0, 0, 0,
            0, 0, 0, 2, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ]);
    })

    test('get', () => {
        const board = new Board()
        expect(board.get({x: 0, y: 0})).toEqual(0);
        expect(board.get({x: 3, y: 3})).toEqual(1);
        expect(board.get({x: -1, y: -1})).toEqual(-1);
    })

    test('set', () => {
        const board = new Board()
        board.set({x: 0, y: 0}, 1);
        expect(board.data[0]).toEqual(1);
    })

    test('covers', () => {
        const board = new Board()
        expect(board.covers({x: 5, y: 4})).toBeTruthy();
        expect(board.covers({x: 7, y: 0})).toBeTruthy();
        expect(board.covers({x: 0, y: 0})).toBeTruthy();
        expect(board.covers({x: 0, y: 7})).toBeTruthy();
        expect(board.covers({x: 7, y: 7})).toBeTruthy();
        expect(board.covers({x: 8, y: 4})).toBeFalsy();
        expect(board.covers({x: 3, y: -1})).toBeFalsy();
        expect(board.covers({x: -1, y: 3})).toBeFalsy();
        expect(board.covers({x: 4, y: 8})).toBeFalsy();
    });
})