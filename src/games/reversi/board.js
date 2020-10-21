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
 * Directions iterators
 *
 * @type {{
 *   DOWN: {next: (function(number): number), check: (function(number): boolean)},
 *   LEFT: {next: (function(number): number), check: (function(number): boolean)},
 *   RIGHT: {next: (function(number): number), check: (function(number): boolean)},
 *   UP: {next: (function(number): number), check: (function(number): boolean)},
 * }}
 */
const directions = {
    LEFT: {
        next: (x) => x - 1,
        check: (x) => (x % 8) < 7
    },
    UP: {
        next: (x) => x - 8,
        check: (x) => x >= 0
    },
    DOWN: {
        next: (x) => x + 8,
        check: (x) => x < 64
    },
    RIGHT: {
        next: (x) => x + 1,
        check: (x) => (x % 8) > 0
    },
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
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 2, 0, 0, 0,
            0, 0, 0, 2, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ]
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
     * @param {number} index - Player token index [0, 63]
     * @param {{
     *   next: (function(number): number),
     *   check: (function(number): boolean)
     * }} direction - direction iterator
     * @return {[number]} Opponent fields
     */
    getOpponentFields(color, index, direction) {
        const fields = [];
        const opponentColor = 3 - color;
        let i = direction.next(index);
        while (direction.check(i) && this.fields[i] === opponentColor) {
            fields.push(i);
            i = direction.next(i);
        }
        if (direction.check(i) && this.fields[i] === color) {
            return fields;
        }
        return [];
    }

    /**
     * Sets a token on this board
     *
     * @param {ObjectID} player - Player ID
     * @param {number} index - Token coordinate (0, 0) to (7, 7)
     * @return {number} Error code
     **/
    set(player, index) {
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
        if (index >= 0 && index < 64 && this.fields[index] === 0) {
            const fields = [
                ...this.getOpponentFields(color, index, directions.LEFT),
                ...this.getOpponentFields(color, index, directions.UP),
                ...this.getOpponentFields(color, index, directions.DOWN),
                ...this.getOpponentFields(color, index, directions.RIGHT)
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
    directions,
    States,
    ErrorCodes
}