const {describe, test} = require("@jest/globals")
const {Board, States, ErrorCodes} = require("../../../src/games/reversi/board.js");


describe('test board constructor', () => {
    test('default', () => {
        const board = new Board(7, 12, 15)
        expect(board.id).toEqual(7);
        expect(board.white).toEqual(12);
        expect(board.black).toEqual(15);
        expect(board.count).toEqual(4);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
});


describe('test get color', () => {
    const board = new Board(7, 12, 15);
    test('invalid', () => {
        expect(board.getColor(5)).toEqual(undefined);
    });
    test('white', () => {
        expect(board.getColor(12)).toEqual(1);
    });
    test('black', () => {
        expect(board.getColor(15)).toEqual(2);
    });
});

describe('test get opponent fields', () => {
    const white = 12;
    const black = 15;
    const color = 2;
    const board = new Board(7, white, black);
    board.fields = [
        [0, 0, 0, 1, 1, 2, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 2],
        [0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    //todo use proper mocks
    const it = board.iterators.RIGHT
    test('middle', () => {
        const fields = board.getOpponentFields(color, {x: 2, y: 0}, it);
        expect(fields).toEqual([{x: 3, y: 0}, {x: 4, y: 0}]);
    });
    test('edge', () => {
        const fields = board.getOpponentFields(color, {x: 2, y: 1}, it);
        expect(fields).toEqual([{x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}]);
    });
    test('middle empty', () => {
        const fields = board.getOpponentFields(color, {x: 2, y: 2}, it);
        expect(fields).toEqual([]);
    });
    test('edge empty', () => {
        const fields = board.getOpponentFields(color, {x: 2, y: 3}, it);
        expect(fields).toEqual([]);
    });
    test('empty', () => {
        const fields = board.getOpponentFields(color, {x: 2, y: 5}, it);
        expect(fields).toEqual([]);
    });
});

describe('test set', () => {
    const white = 12;
    const black = 15;
    const board = new Board(7, white, black);
    test('invalid player', () => {
        expect(board.set(5, {x: 0, y: 0})).toEqual(ErrorCodes.NOT_YOUR_GAME);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('opponent player', () => {
        expect(board.set(white, {x: 0, y: 0})).toEqual(ErrorCodes.NOT_YOUR_TURN);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('low coordinate', () => {
        expect(board.set(black, {x: -2, y: 5})).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('high coordinate', () => {
        expect(board.set(black, {x: 4, y: 8})).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('invalid coordinate', () => {
        expect(board.set(black, {x: 1, y: 1})).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('valid coordinate', () => {
        expect(board.set(black, {x: 2, y: 3})).toEqual(ErrorCodes.NO_ERROR);
        expect(board.state).toEqual(States.NEXT_WHITE);
    });
});