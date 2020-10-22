const {FieldIterator, isOnBoard} = require('./fieldIterator')

/**
 * Possible game states
 *
 * @type {{
 *   NEXT_WHITE: number,
 *   END_BLACK_VICTORY: number,
 *   NEXT_BLACK: number,
 *   END_WHITE_VICTORY: number,
 *   END_TIE: number
 * }}
 */
const States = {
    NEXT_WHITE: 1,
    NEXT_BLACK: 2,
    END_TIE: 10,
    END_WHITE_VICTORY: 11,
    END_BLACK_VICTORY: 12,
}

/**
 * Possible error codes
 *
 * @type {{
 *   GAME_FINISHED: number,
 *   INVALID_COORDINATE: number,
 *   NO_ERROR: number,
 *   NOT_YOUR_GAME: number,
 *   NOT_YOUR_TURN: number
 * }}
 */
const ErrorCodes = {
    NO_ERROR: 0,
    GAME_FINISHED: 10,
    NOT_YOUR_GAME: 20,
    NOT_YOUR_TURN: 21,
    INVALID_COORDINATE: 30
}

/**
 * Board class
 */
class Board {
    /**
     * Class constructor
     *
     * @param {ObjectID} id - Board ID
     * @param {ObjectID} white - White player ID
     * @param {ObjectID} black - Black player ID
     */
    constructor(id, white, black) {
        // field state: 0 empty, 1 white, 2 black
        this.id = id;
        this.fields = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]
        this.history = []
        this.iterators = {
            RIGHT: new FieldIterator(this, {x: 1, y: 0}),
            RIGHT_UP: new FieldIterator(this, {x: 1, y: 1}),
            UP: new FieldIterator(this, {x: 0, y: 1}),
            LEFT_UP: new FieldIterator(this, {x: -1, y: 1}),
            LEFT: new FieldIterator(this, {x: -1, y: 0}),
            LEFT_DOWN: new FieldIterator(this, {x: -1, y: -1}),
            DOWN: new FieldIterator(this, {x: 0, y: -1}),
            RIGHT_DOWN: new FieldIterator(this, {x: 1, y: -1}),
        }
        this.white = white;
        this.black = black;
        this.count = 4;
        this.state = States.NEXT_BLACK;
    }

    /**
     * Returns the color of a given player
     *
     * @param {ObjectID} player - Player ID
     * @return {number} - Returns player color: 1 -> white, 2 -> black,
     * or undefined if the player is not a member of this board
     */
    getColor(player) {
        return player === this.white ? 1 : player === this.black ? 2 : undefined;
    }

    /**
     * List all opponent fields of a given direction iterator
     *
     * @param {number} color - Player color: 1 white, 2 black
     * @param {Vec2} point - Player token index [0, 63]
     * @param {FieldIterator} iterator - field iterator
     * @return {[number]} Opponent fields
     */
    getOpponentFields(color, point, iterator) {
        const fields = [];
        const opponentColor = 3 - color;
        iterator.set(point);
        let state = iterator.next();
        while (state === opponentColor) {
            fields.push({
                x: iterator.point.x,
                y: iterator.point.y,
            });
            state = iterator.next();
        }
        if (state === color) {
            return fields;
        }
        return [];
    }

    /**
     * Sets a token on this board
     *
     * @param {ObjectID} player - Player ID
     * @param {Vec2} point - Token coordinate (0, 0) to (7, 7)
     * @return {number} Error code
     **/
    set(player, point) {
        // check board state
        if (this.state >= 10) {
            return ErrorCodes.GAME_FINISHED;
        }
        // check player's turn
        const color = this.getColor(player);
        if (color === undefined) {
            return ErrorCodes.NOT_YOUR_GAME;
        } else if (color !== this.state) {
            return ErrorCodes.NOT_YOUR_TURN;
        }
        // check field coordinate and range
        if (isOnBoard(point)) {
            const fields = [
                ...this.getOpponentFields(color, point, this.iterators.RIGHT),
                ...this.getOpponentFields(color, point, this.iterators.RIGHT_UP),
                ...this.getOpponentFields(color, point, this.iterators.UP),
                ...this.getOpponentFields(color, point, this.iterators.LEFT_UP),
                ...this.getOpponentFields(color, point, this.iterators.LEFT),
                ...this.getOpponentFields(color, point, this.iterators.LEFT_DOWN),
                ...this.getOpponentFields(color, point, this.iterators.DOWN),
                ...this.getOpponentFields(color, point, this.iterators.RIGHT_DOWN),
            ];
            if (fields.length > 0) {
                // valid action
                // todo perform action

                this.state = States.NEXT_WHITE;
                return ErrorCodes.NO_ERROR;
            }
        }
        return ErrorCodes.INVALID_COORDINATE;
    }
}

module.exports = {
    Board,
    States,
    ErrorCodes
}