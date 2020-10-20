/**
 * Possible game states
 * @type {{NEXT_WHITE: number, END_BLACK_VICTORY: number, NEXT_BLACK: number, END_WHITE_VICTORY: number, END_TIE: number}}
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
 * @type {{GAME_FINISHED: number, INVALID_COORDINATE: number, NO_ERROR: number, NOT_YOUR_GAME: number, NOT_YOUR_TURN: number}}
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
     *
     * @param {ObjectID} player - Player ID
     * @return {number} - Returns player color
     *   0 undefined
     *   1 white
     *   2 black
     */
    getColor(player) {
        return player === this.white ? 1 : player === this.black ? 2 : undefined;
    }

    /**
     * Sets a token on this board
     * @param {ObjectID} player - Player ID
     * @param {number} coordinate - Token coordinate [0, 63]
     * @return {number} Error code
     **/
    set(player, coordinate) {
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
        const opponentColor = 3 - color;
        // check field coordinate and range
        if (coordinate >= 0 && coordinate < 64 && this.fields[coordinate] === 0) {
            // check neighbours
            const left = coordinate - 1;
            const up = coordinate - 8;
            const right = coordinate + 1;
            const down = coordinate + 8;
            if (left > 0 && this.fields[left] === opponentColor ||
                up > 0 && this.fields[up] === opponentColor ||
                right > 0 && this.fields[right] === opponentColor ||
                down > 0 && this.fields[down] === opponentColor) {
                // correct action
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