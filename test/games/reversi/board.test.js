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