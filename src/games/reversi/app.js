const {Board, GameStates} = require('./board')

const boards = {};

module.exports = {
    create: (white, black) => {
        // todo create ObjectID
        const board = new Board(7, white, black);
        boards[board.id] = board;
        return board.id;
    },
    set: (boardID, player, coord) => {
        const board = boards[boardID];
        return board.set(player, coord);
    },
    count: () => {
        return boards.count();
    },
    GameStates
}