const constValue = require('../constValue');

/**
 * @typedef {object} LedPosition
 * @property {number} Row - Row of total matrix.
 * @property {number} Column - Column of total matrix.
 * @property {number} BoardRow - Row of board matrix.
 * @property {number} BoardColumn - Column of board matrix.
 */
class LedPosition {
    constructor(indexX, indexY) {
        /** @type {number} - Row of total matrix. */
        this.Row = indexX;
        /** @type {number} - Column of total matrix. */
        this.Column = indexY;
        /** @type {number} - Row of board matrix. */
        this.BoardRow = indexX % constValue.BoardLedHeight;
        /** @type {number} - Column of board matrix. */
        this.BoardColumn = indexY % constValue.BoardLedWidth;
    }
}

module.exports = LedPosition;
