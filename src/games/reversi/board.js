const {index, isInRange} = require("./math")

/**
 * UNDEFINED: -1,
 * EMPTY: 0,
 * WHITE: 1,
 * BLACK: 2,
 */

class Board {
    constructor() {
        this.data = [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 2, 0, 0, 0,
            0, 0, 0, 2, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ]
    }

    /**
     * Checks if a point is on the board
     *
     * @param {Vec2} vec
     * @return {boolean}
     */
    covers(vec) {
        return isInRange(vec.x) && isInRange(vec.y);
    }

    /**
     * Sets a given state on the board
     *
     * @param {Vec2} vec
     * @param {number} state
     */
    set(vec, state) {
        if (this.covers(vec) && state >= 0) {
            this.data[index(vec)] = state;
        }
    }

    /**
     * Gets a state from the board
     *
     * @param {Vec2} vec
     * @return {number}
     */
    get(vec) {
        if (this.covers(vec)) {
            return this.data[index(vec)];
        }
        return -1;
    }
}

module.exports = {
    Board
}