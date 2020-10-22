const {Match, GameStates} = require('./match')

const matches = {};

module.exports = {
    create: (white, black) => {
        // todo create ObjectID
        const match = new Match(7, white, black);
        matches[match.id] = match;
        return match.id;
    },
    set: (matchID, player, vec) => {
        const board = matches[matchID];
        return board.set(player, vec);
    },
    count: () => {
        return matches.count();
    },
    GameStates
}