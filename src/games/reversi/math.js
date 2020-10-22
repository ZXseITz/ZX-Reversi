/**
 * @typedef {{x: number, y: number}} Vec2
 */

module.exports = {
    /**
     * Calculates the flat index of a two dimensional vector
     *
     * @param {Vec2} vec - Vector
     * @param {number} [size] - First dimension size
     * @return {number} flat index
     */
    index: (vec, size= 8) => vec.y * size + vec.x,

    /**
     * Checks a value is in interval [start, end]
     *
     * @param {number} value - Value
     * @param {number} [start] - Start value
     * @param {number} [end] - End value
     * @return {boolean} True if the value is inside the interval, or false otherwise
     */
    isInRange: (value, start= 0, end= 7) => value >= start && value <= end,
}