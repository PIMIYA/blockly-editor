class LedNode {
    constructor() {
        /** @type {number} - Index of node server. */
        this.Index = null;
        /** @type {string} - Host of node server. */
        this.Host = '';
        /** @type {number[]} - Boards index on node server. */
        this.BoardsIndex = [];
    }
}

module.exports = LedNode;
