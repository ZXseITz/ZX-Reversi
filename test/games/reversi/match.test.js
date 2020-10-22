const {describe, test, beforeEach} = require("@jest/globals")
const {Match, GameStates, ErrorCodes} = require("../../../src/games/reversi/match.js");
const {Board} = require("../../../src/games/reversi/board");
const {BoardIterator} = require("../../../src/games/reversi/boardIterator");


const mockBoardCovers = jest.fn();
const mockBoardGet = jest.fn();
const mockBoardSet = jest.fn();
jest.mock("../../../src/games/reversi/board", () => {
    // Works and lets you check for constructor calls:
    return {
        Board: jest.fn().mockImplementation(() => {
            return {
                covers: mockBoardCovers,
                get: mockBoardGet,
                set: mockBoardSet,
            };
        }),
    };
});

const mockBoardIteratorGet = jest.fn();
const mockBoardIteratorSet = jest.fn();
const mockBoardIteratorNext = jest.fn();
jest.mock("../../../src/games/reversi/boardIterator", () => {
    return {
        BoardIterator: jest.fn().mockImplementation(() => {
            return {
                get: mockBoardIteratorGet,
                set: mockBoardIteratorSet,
                next: mockBoardIteratorNext,
            };
        }),
    };
});

describe('test match', () => {
    const white = 12;
    const black = 15;
    const color = 2;

    beforeEach(() => {
        Board.mockClear();
        mockBoardCovers.mockClear();
        mockBoardGet.mockClear();
        mockBoardSet.mockClear();

        BoardIterator.mockClear();
        mockBoardIteratorGet.mockClear();
        mockBoardIteratorSet.mockClear();
        mockBoardIteratorNext.mockClear();
    })

    test('constructor', () => {
        const match = new Match(7, white, black);
        expect(Board.mock.calls.length).toEqual(1);
        expect(match.id).toEqual(7);
        expect(match.white).toEqual(12);
        expect(match.black).toEqual(15);
        expect(match.count).toEqual(4);
        expect(match.state).toEqual(GameStates.NEXT_BLACK);
    })

    test('test get color invalid', () => {
        const match = new Match(7, white, black)
        expect(match.getColor(5)).toEqual(undefined);
    });
    test('test get color white', () => {
        const match = new Match(7, white, black)
        expect(match.getColor(white)).toEqual(1);
    });
    test('test get color black', () => {
        const match = new Match(7, white, black)
        expect(match.getColor(black)).toEqual(2);
    });

    test('test get opponent fields outside', () => {
        mockBoardIteratorNext.mockReturnValueOnce(1);
        mockBoardIteratorNext.mockReturnValueOnce(1);
        mockBoardIteratorNext.mockReturnValue(-1);

        const match = new Match(7, white, black);
        const it = new BoardIterator(match.board, {x: 1, y: 0});
        const fields = match.getOpponentFields(color, {x: 2, y: 0}, it);

        expect(mockBoardIteratorSet.mock.calls.length).toEqual(1);
        expect(mockBoardIteratorSet.mock.calls[0][0]).toEqual({x: 2, y: 0});
        expect(mockBoardIteratorNext.mock.calls.length).toEqual(3);
        expect(fields).toEqual([]);
    });
    test('test get opponent fields invalid last token', () => {
        mockBoardIteratorNext.mockReturnValueOnce(1);
        mockBoardIteratorNext.mockReturnValueOnce(1);
        mockBoardIteratorNext.mockReturnValueOnce(0);
        mockBoardIteratorNext.mockReturnValue(-1);

        const match = new Match(7, white, black);
        const it = new BoardIterator(match.board, {x: 1, y: 0});
        const fields = match.getOpponentFields(color, {x: 2, y: 0}, it);

        expect(mockBoardIteratorSet.mock.calls.length).toEqual(1);
        expect(mockBoardIteratorSet.mock.calls[0][0]).toEqual({x: 2, y: 0});
        expect(mockBoardIteratorNext.mock.calls.length).toEqual(3);
        expect(fields).toEqual([]);
    });

    test('test get opponent fields valid', () => {
        mockBoardIteratorNext.mockReturnValueOnce(1);
        mockBoardIteratorNext.mockReturnValueOnce(1);
        mockBoardIteratorNext.mockReturnValueOnce(2);
        mockBoardIteratorNext.mockReturnValueOnce(0);
        mockBoardIteratorNext.mockReturnValue(-1);
        mockBoardIteratorGet.mockReturnValueOnce({x: 3, y: 0});
        mockBoardIteratorGet.mockReturnValueOnce({x: 4, y: 0});

        const match = new Match(7, white, black);
        const it = new BoardIterator(match.board, {x: 1, y: 0});
        const fields = match.getOpponentFields(color, {x: 2, y: 0}, it);

        expect(mockBoardIteratorSet.mock.calls.length).toEqual(1);
        expect(mockBoardIteratorSet.mock.calls[0][0]).toEqual({x: 2, y: 0});
        expect(mockBoardIteratorNext.mock.calls.length).toEqual(3);
        expect(fields).toEqual([{x: 3, y: 0}, {x: 4, y: 0}]);
    });

    test('test set invalid player', () => {
        const match = new Match(7, white, black);
        expect(match.set(1, {x: 0, y: 0})).toEqual(ErrorCodes.NOT_YOUR_GAME);
        expect(match.state).toEqual(GameStates.NEXT_BLACK);
    });
    test('test set opponent player', () => {
        const match = new Match(7, white, black);
        expect(match.set(white, {x: 0, y: 0})).toEqual(ErrorCodes.NOT_YOUR_TURN);
        expect(match.state).toEqual(GameStates.NEXT_BLACK);
    });
    test('test set low coordinate', () => {
        mockBoardCovers.mockReturnValue(false);

        const match = new Match(7, white, black);
        expect(match.set(black, {x: -2, y: 5})).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(match.state).toEqual(GameStates.NEXT_BLACK);
    });
    test('test set high coordinate', () => {
        mockBoardCovers.mockReturnValue(false);

        const match = new Match(7, white, black);
        expect(match.set(black, {x: 4, y: 8})).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(match.state).toEqual(GameStates.NEXT_BLACK);
    });
    test('test set taken coordinate', () => {
        mockBoardCovers.mockReturnValue(true);
        mockBoardGet.mockReturnValue(1);

        const match = new Match(7, white, black);
        expect(match.set(black, {x: 1, y: 1})).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(match.state).toEqual(GameStates.NEXT_BLACK);
    });
    test('test set invalid coordinate', () => {
        const mockGetOpponentFields = jest.fn();
        mockGetOpponentFields.mockReturnValue([]);

        mockBoardCovers.mockReturnValue(true);
        mockBoardGet.mockReturnValue(0);
        const match = new Match(7, white, black);
        match.getOpponentFields = mockGetOpponentFields;

        expect(match.set(black, {x: 2, y: 3})).toEqual(ErrorCodes.INVALID_COORDINATE);
        expect(match.state).toEqual(GameStates.NEXT_BLACK);
    });
    test('test set valid coordinate', () => {
        const mockGetOpponentFields = jest.fn();
        mockGetOpponentFields.mockReturnValueOnce([{x: 3, y: 3}]);
        mockGetOpponentFields.mockReturnValue([]);

        mockBoardCovers.mockReturnValue(true);
        mockBoardGet.mockReturnValue(0);
        const match = new Match(7, white, black);
        match.getOpponentFields = mockGetOpponentFields;

        expect(match.set(black, {x: 2, y: 3})).toEqual(ErrorCodes.NO_ERROR);
        expect(match.state).toEqual(GameStates.NEXT_WHITE);
    });
});