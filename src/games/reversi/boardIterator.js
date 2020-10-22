const {Board} = require("./board");

class BoardIterator {
    /**
     * BoardIterator constructor
     *
     * @param {Board} board
     * @param {Vec2} direction
     */
    constructor(board, direction) {
        this.board = board;
        this.dir = direction;
        this.point = {x: 0, y: 0};
    }

    /**
     * Sets the start point
     *
     * @param {Vec2} point
     */
    set(point) {
        this.point = {...point};
    }

    get() {
        return {...this.point}
    }

    /**
     * Moves the iterator to the next field and returns whose state
     *
     * @return {number} next state
     */
    next() {
        this.point = {
            x: this.point.x + this.dir.x,
            y: this.point.y + this.dir.y,
        };
        return this.board.get(this.point);
    }
}

module.exports = {
    BoardIterator
}