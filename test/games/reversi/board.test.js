const {describe, test} = require("@jest/globals")
const {Board, directions, States, ErrorCodes} = require("../../../src/games/reversi/board.js");


/**
  0  1  2  3  4  5  6  7
  8  9 10 11 12 13 14 15
 16 17 18 19 20 21 22 23
 24 25 26 27 28 29 30 31
 32
 40
 48 49 50 51 52 53 54 55
 56 57 58 59 60 61 62 63
**/

describe('test left direction iterator', () => {
    test('next', () => {
        expect(directions.LEFT.next(20)).toEqual(19);
    });
    test('check', () => {
        expect(directions.LEFT.check(20)).toBeTruthy();
        expect(directions.LEFT.check(16)).toBeTruthy();
        expect(directions.LEFT.check(15)).toBeFalsy();
    });
});

describe('test up direction iterator', () => {
    test('next', () => {
        expect(directions.UP.next(27)).toEqual(19);
    });
    test('check', () => {
        expect(directions.UP.check(27)).toBeTruthy();
        expect(directions.UP.check(3)).toBeTruthy();
        expect(directions.UP.check(0)).toBeTruthy();
        expect(directions.UP.check(-1)).toBeFalsy();
    });
});

describe('test down direction iterator', () => {
    test('next', () => {
        expect(directions.DOWN.next(19)).toEqual(27);
    });
    test('check', () => {
        expect(directions.DOWN.check(19)).toBeTruthy();
        expect(directions.DOWN.check(59)).toBeTruthy();
        expect(directions.DOWN.check(63)).toBeTruthy();
        expect(directions.DOWN.check(64)).toBeFalsy();
    });
});

describe('test right direction iterator', () => {
    test('next', () => {
        expect(directions.RIGHT.next(19)).toEqual(20);
    });
    test('check', () => {
        expect(directions.RIGHT.check(19)).toBeTruthy();
        expect(directions.RIGHT.check(23)).toBeTruthy();
        expect(directions.RIGHT.check(24)).toBeFalsy();
    });
});

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

describe('test set', () => {
    const white = 12;
    const black = 15;
    const board = new Board(7, white, black);
    test('invalid player', () => {
        expect(board.set(5, 0)).toEqual(ErrorCodes.NOT_YOUR_GAME);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('opponent player', () => {
        expect(board.set(white, 0)).toEqual(ErrorCodes.NOT_YOUR_TURN);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('low coordinate', () => {
        expect(board.set(black, -2)).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('low coordinate', () => {
        expect(board.set(black, 64)).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('invalid coordinate', () => {
        expect(board.set(black, 0)).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(board.state).toEqual(States.NEXT_BLACK);
    });
    test('valid coordinate', () => {
        expect(board.set(black, 26)).toEqual(ErrorCodes.NO_ERROR);
        expect(board.state).toEqual(States.NEXT_WHITE);
    });
});

describe('test get opponent fields', () => {
    const white = 12;
    const black = 15;
    const color = 2;
    const board = new Board(7, white, black);
    board.fields = [
        0, 0, 0, 1, 1, 2, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 2,
        0, 0, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ];
    test('middle', () => {
        const fields = board.getOpponentFields(color, 2, directions.RIGHT);
        expect(fields).toEqual([3, 4]);
    });
    test('edge', () => {
        const fields = board.getOpponentFields(color, 10, directions.RIGHT);
        expect(fields).toEqual([11, 12, 13, 14]);
    });
    test('middle empty', () => {
        const fields = board.getOpponentFields(color, 18, directions.RIGHT);
        expect(fields).toEqual([]);
    });
    test('edge empty', () => {
        const fields = board.getOpponentFields(color, 26, directions.RIGHT);
        expect(fields).toEqual([]);
    });
    test('empty', () => {
        const fields = board.getOpponentFields(color, 34, directions.RIGHT);
        expect(fields).toEqual([]);
    });
});