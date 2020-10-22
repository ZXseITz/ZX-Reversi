/**
 * @typedef {{x: number, y: number}} Vec2
 */

/**
 * Checks if a point is on the board
 *
 * @param {Vec2} point
 * @return {boolean}
 */
const isOnBoard = (point) => point.x >= 0 && point.x < 8 && point.y >= 0 && point.y < 8;

class FieldIterator {
    /**
     * FieldIterator constructor
     *
     * @param {[[number]]} fields
     * @param {Vec2} direction
     */
    constructor(board, direction) {
        this.board = board;
        this.dir = direction;
        this.point = undefined;
    }

    /**
     * Sets the start point
     *
     * @param {Vec2} point
     */
    set(point) {
        if (isOnBoard(point)) {
            this.point = {
                x: point.x,
                y: point.y,
            };
        }
    }

    /**
     * Moves the iterator to the next field and returns whose state
     *
     * @return {number} next state
     */
    next() {
        if (this.point !== undefined) {
            this.point.x += this.dir.x;
            this.point.y += this.dir.y;
            if (isOnBoard(this.point)) {
                return this.board.fields[this.point.y][this.point.x];
            }
            this.point = undefined;
        }
        return -1;
    }
}

module.exports = {
    FieldIterator,
    isOnBoard
}