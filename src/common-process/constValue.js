const Color = require('./color');

const NODE_ROW = 1;
const NODE_COLUMN = 1;
// const NODE_ROW = 3;
// const NODE_COLUMN = 13;
// 每個 node 上的 board row
const BOARD_ROW = 1;
// 每個 node 上的 board column
const BOARD_COLUMN = 1;
// 每個 board led 寬
const BOARD_LED_WIDTH = 8;
// const BOARD_LED_WIDTH = 6;
// 每個 board led 高
const BOARD_LED_HEIGHT = 8;
// const BOARD_LED_HEIGHT = 6;

module.exports = {
    /** @type {Color} */
    Colors: new Color(),

    /** @type {number} Column of Node */
    NodeColumn: NODE_COLUMN,
    /** @type {number} Row of Node */
    NodeRow: NODE_ROW,
    /** @type {number} 總共幾個 node */
    NodeCount: NODE_ROW * NODE_COLUMN,

    /** @type {number} 每個 node 的 board 的 column 數量 */
    BoardColumn: BOARD_COLUMN,
    /** @type {number} 每個 node 的 board 的 row 數量 */
    BoardRow: BOARD_ROW,
    /** @type {number} 每個 node 有幾個 board */
    BoardCount: BOARD_ROW * BOARD_COLUMN,
    /** @type {number} 總共多少 board */
    TotalBoard: BOARD_ROW * BOARD_COLUMN * NODE_ROW * NODE_COLUMN,

    /** @type {number} 每個 board led 寬 */
    BoardLedWidth: BOARD_LED_WIDTH,
    /** @type {number} 每個 board led 高 */
    BoardLedHeight: BOARD_LED_HEIGHT,

    /** @type {number} 每個 node led 寬 */
    NodeLedWidth: BOARD_LED_WIDTH * BOARD_COLUMN,
    /** @type {number} 每個 node led 高 */
    NodeLedHeight: BOARD_LED_HEIGHT * BOARD_ROW,

    /** @type {number} 總 led 寬 */
    TotalLedWidth: BOARD_LED_WIDTH * BOARD_COLUMN * NODE_COLUMN,
    /** @type {number} 總 led 高 */
    TotalLedHeight: BOARD_LED_HEIGHT * BOARD_ROW * NODE_ROW,

    refreshTotalCount: function () {
        this.TotalBoard = this.BoardCount * this.NodeCount;
        this.TotalLedWidth = this.BoardLedWidth * this.BoardColumn * this.NodeColumn;
        this.TotalLedHeight = this.BoardLedHeight * this.BoardRow * this.NodeRow;
    },

    /**
     *
     * @param {number} row Node count of row.
     * @param {number} column Node count of column.
     */
    setNodeCount: function (row, column) {
        this.NodeColumn = column;
        this.NodeRow = row;
        this.NodeCount = row * column;
        this.refreshTotalCount();
    },

    /**
     *
     * @param {number} row Board count of row on Node.
     * @param {number} column Board count of column on Node.
     */
    setBoardCount: function (row, column) {
        this.BoardColumn = column;
        this.BoardRow = row;
        this.BoardCount = row * column;

        this.NodeLedWidth = this.BoardLedWidth * column;
        this.NodeLedHeight = this.BoardLedHeight * row;

        this.refreshTotalCount();
    },

    /**
     * Default array of Led.
     * @param {number} w width
     * @param {number} h height
     * @returns {Array<number>} Default full led array. (w x h)
     */
    defaultLedArray: function (w, h, color) {
        color = (color !== undefined) ? color : this.Colors.BLACK;
        let width = w || this.TotalLedWidth;
        let height = h || this.TotalLedHeight;

        let led = [];
        for (let index = 0; index < height; index++) {
            let tmp = [];
            tmp.length = width;
            tmp.fill(color);
            led.push(tmp);
        }
        return led;
    },

    /**
     * Default array of button.
     * @param {number} w width
     * @param {number} h height
     * @returns {Array<number>} Default full button array. (w x h)
     */
    defaultButtonArray: function (w, h) {
        let width = w || this.TotalLedWidth;
        let height = h || this.TotalLedHeight;

        let led = [];
        for (let index = 0; index < height; index++) {
            let tmp = [];
            tmp.length = width;
            tmp.fill(0);
            led.push(tmp);
        }
        return led;
    },

    dumpInfo() {
        console.log(`Total Node: ${this.NodeCount}`);
        console.log(`Node(R x C): ${this.NodeRow} x ${this.NodeColumn}`);
        console.log(`   Board(R x C): ${this.BoardRow} x ${this.BoardColumn}`);
        console.log(`       Led(W x H): ${this.BoardLedWidth} x ${this.BoardLedHeight}`);
        console.log(`Total Board: ${this.TotalBoard}`);
        console.log(`   Led(W x H): ${this.TotalLedWidth} x ${this.TotalLedHeight}`);
    }
};
