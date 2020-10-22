const {describe, test, beforeEach} = require("@jest/globals")
const {BoardIterator} = require("../../../src/games/reversi/boardIterator");
const {Board} = require("../../../src/games/reversi/board");

const mockGet = jest.fn();
const mockSet = jest.fn();
const mockCovers = jest.fn();
jest.mock("../../../src/games/reversi/board", () => {
    // Works and lets you check for constructor calls:
    return {
        Board: jest.fn().mockImplementation(() => {
            return {
                set: mockSet,
                get: mockGet,
                covers: mockCovers,
            };
        }),
    };
});

describe('test field iterator', () => {
    beforeEach(() => {
        Board.mockClear();
        mockSet.mockClear();
        mockGet.mockClear();
        mockCovers.mockClear();
    })
    test('constructor', () => {
        const board = new Board();
        const it = new BoardIterator(board, {x: 1, y: 0});
        expect(it.board).toBe(board);
        expect(it.dir).toEqual({x: 1, y: 0});
        expect(it.point).toEqual({x: 0, y: 0});
    });
    test('get', () => {
        mockCovers.mockReturnValueOnce(true);
        const it = new BoardIterator(new Board(), {x: 1, y: 0});
        expect(it.get()).toEqual({x: 0, y: 0});
    });
    test('set', () => {
        mockCovers.mockReturnValueOnce(true);
        const it = new BoardIterator(new Board(), {x: 1, y: 0});
        it.set({x: 3, y: 2});
        expect(it.point).toEqual({x: 3, y: 2});
    });
    test('next', () => {
        mockCovers.mockReturnValueOnce(true);
        mockCovers.mockReturnValueOnce(true);
        mockCovers.mockReturnValueOnce(true);
        mockCovers.mockReturnValue(false);

        mockGet.mockReturnValueOnce(1);
        mockGet.mockReturnValueOnce(0);
        mockGet.mockReturnValue(-1);

        const it = new BoardIterator(new Board(), {x: 1, y: 0});
        it.set({x: 0, y: 3});

        expect(it.next()).toEqual(1);
        expect(it.next()).toEqual(0);
        expect(it.next()).toEqual(-1);
        expect(it.next()).toEqual(-1);
        expect(mockGet.mock.calls.length).toEqual(4);
        expect(mockGet.mock.calls[0][0]).toEqual({x: 1, y: 3});
        expect(mockGet.mock.calls[1][0]).toEqual({x: 2, y: 3});
        expect(mockGet.mock.calls[2][0]).toEqual({x: 3, y: 3});
        expect(mockGet.mock.calls[3][0]).toEqual({x: 4, y: 3});
    });
});
