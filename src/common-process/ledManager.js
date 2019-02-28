const _ = require('underscore');
const Jimp = require('jimp');

const Dict = require('./dict');
const LedPosition = require('./modules/LedPosition');
const constValue = require('./constValue');
const modeEnum = require('./modeEnum');
const utils = require('./utils');

const _dict = new Dict();

/**
 * Marquee the array.
 * @param {Array<number>} input Array to marquee.
 * @param {number} number Shift value of marquee.
 * Shift to left is number is positive;
 * Shift to right is number is negative.
 * @returns {Array<number>} Marquee array.
 */
function marqueeArray(input, shift) {
    let isReverse = shift < 0;
    if (!input || shift == 0) {
        return input;
    }

    shift = (shift !== undefined) ? shift : 1;
    shift = Math.abs(shift);
    if (input.length <= shift) {
        shift = input.length - 1;
    }

    for (let count = 0; count < shift; count++) {
        if (isReverse) {
            input.unshift(input.pop());
        } else {
            input.push(input.shift());
        }
    }

    return input;
}

/**
 * 合併兩個 Led 資料， dest 資料中如果有 NO_CHANGE，則使用 src 的資料
 * @param {string[]} src
 * @param {string[]} dest
 * @returns {string[]}
 */
function mergeLed(src, dest, ignoreSize) {
    ignoreSize = (ignoreSize !== undefined) ? ignoreSize : false;
    let src1d = _.flatten(src);
    let dest1d = _.flatten(dest);
    if (!ignoreSize && src1d.length != dest1d.length) {
        return src.slice();
    }

    let len = src1d.length > dest1d.length ?
        dest1d.length :
        src1d.length;
    let width = src1d.length > dest1d.length ?
        dest.length :
        src.length;

    let result = [];
    for (let index = 0; index < len; index++) {
        const s = src1d[index];
        const d = dest1d[index];
        result.push(d == -1 ? s : d);
    }

    let columnCount = len / width;
    return _.chunk(result, columnCount);
}

let _originImage = new Jimp(78, 18, '#ffffff');

/**
 *
 * @param {string} filePath
 * @returns {Array<Array<string>>}
 */
async function jimpToLed(filePath) {
    try {
        let led = _dict.get(filePath);
        if (led != null) {
            return led;
        }

        let image = await Jimp.read(filePath);
        let tmp = [];
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            let r = this.bitmap.data[idx + 0];
            let g = this.bitmap.data[idx + 1];
            let b = this.bitmap.data[idx + 2];

            // 實作 rgb(240, 240, 240) #f0f0f0 不更換顏色
            // let hexClr = (r == constValue.Colors.NO_CHANGE_RGB.r &&
            //         g == constValue.Colors.NO_CHANGE_RGB.g &&
            //         b == constValue.Colors.NO_CHANGE_RGB.b) ?
            //     constValue.Colors.NO_CHANGE :
            //     utils.rgb2Hex(r, g, b);
            let hexClr = utils.rgb2Hex(r, g, b);
            tmp.push(hexClr);
        });

        led = _.chunk(tmp, constValue.TotalLedWidth);
        _dict.addOrUpdate(filePath, led);

        return led;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function ledToJimp(image, callback) {
    new Jimp(_originImage, async (err, image) => {
        await image.setPixelColor(Jimp.rgbaToInt(255, 0, 0, 255), 0, 0);

        if (callback) callback();
    });
}

class ledManager {
    constructor() {
        /** @type {number} Current mode [Free, Art, Blockly] */
        this.mode = modeEnum.FREE;
        /** @type {number} Index of node, Null if is main server */
        this.nodeIndex = null;
        /** @type {Array<Array<string>>} Status of Led color(hex string) */
        this.rawLedStatus = [];
        /** @type {Array<Array<string>>} Runtime status of Led color(hex string) */
        this.runtimeLedStatus = [];
        /** @type {Array<Array<number>>} Status of buttons. 0: disable, 1: enable */
        this.buttonStatus = [];
        /** @type {string} The folder path of resource */
        this.resourcePath = './';
    }

    setResourcePath(path) {
        this.resourcePath = path === undefined ? './' : path;
    }

    /** Reset all led and button status
     */
    resetAll() {
        if (this.nodeIndex == null) {
            this.rawLedStatus = constValue.defaultLedArray();
            this.runtimeLedStatus = this.rawLedStatus.slice();
            this.buttonStatus = constValue.defaultButtonArray();
        } else {
            this.rawLedStatus = constValue.defaultLedArray(
                constValue.NodeLedWidth, constValue.NodeLedHeight);
            this.runtimeLedStatus = this.rawLedStatus.slice();
            this.buttonStatus = constValue.defaultButtonArray();
        }
    }

    /**
     * Set the Index of node server.
     * @param {Object} options
     * @param {number} options.nodeIndex Index of node server. Set null if is main server.
     * @param {string} options.path The folder path of resource.
     */
    init(options) {
        options = options || {};

        this.nodeIndex = options.nodeIndex === undefined ? null : options.nodeIndex;
        this.setResourcePath(options.path);
        this.resetAll();
    }

    getMode() {
        return this.mode;
    }

    setMode(mode) {
        this.mode = mode;
    }

    /**
     * 根據 node index 取得原始的 led 狀態
     * @param {number} nodeIndex Index of node
     * @param {number} boardIndex 每個 Node 上的第幾個 board, null 表示全部
     * @return {Array<Array<number>>}
     */
    getRawLedStatusByNodeIndex(nodeIndex, boardIndex) {
        if (nodeIndex === undefined || boardIndex === undefined) {
            return this.rawLedStatus.slice();
        }

        let nodeRowIdx = Math.floor(nodeIndex / constValue.NodeRow);
        let nodeRowStart = nodeRowIdx * constValue.NodeLedHeight;

        let nodeColIdx = nodeIndex % constValue.NodeColumn;
        let nodeColStart = nodeColIdx * constValue.NodeLedWidth;

        let rowIdx = Math.floor(boardIndex / constValue.BoardRow) % constValue.BoardRow;
        let rowStart = nodeRowStart + rowIdx * constValue.BoardLedHeight;
        let rowEnd = rowStart + constValue.BoardLedHeight;

        let board = [];
        for (let r = rowStart; r < rowEnd; r++) {
            const rowData = this.rawLedStatus[r];
            let colIdx = boardIndex % constValue.BoardColumn;
            let colStart = nodeColStart + colIdx * constValue.BoardLedWidth;
            let colEnd = colStart + constValue.BoardLedWidth;
            board.push(rowData.slice(colStart, colEnd));
        }

        return board;
    }

    /**
     * 取得原始的 led 狀態，若為 node server 則會擷取該 node 上的 board index
     * @param {number} boardIndex 每個 Node 上的第幾個 board, null 表示全部
     * @return {Array<Array<number>>}
     */
    getRawLedStatus(boardIndex) {
        if (boardIndex === undefined) return this.rawLedStatus.slice();

        let rowIdx = Math.floor(boardIndex / constValue.BoardRow);
        let rowStart = rowIdx * constValue.BoardLedHeight;
        let rowEnd = rowStart + constValue.BoardLedHeight;
        let board = [];
        for (let r = rowStart; r < rowEnd; r++) {
            const rowData = this.rawLedStatus[r];
            let colIdx = boardIndex % constValue.BoardColumn;
            let colStart = colIdx * constValue.BoardLedWidth;
            let colEnd = colStart + constValue.BoardLedWidth;
            board.push(rowData.slice(colStart, colEnd));
        }

        return board;
    }

    /**
     * 設定原始 led 狀態，如果為 node server 將會擷取出該 node index 的 led 範圍
     * @param {Array<Array<string>>} led 完整的 led 狀態 (2d array TotalWidth * TotalHeight)
     */
    setRawLedStatus(led) {
        if (this.nodeIndex === null) {
            this.rawLedStatus = mergeLed(this.rawLedStatus, led);
        } else {
            let dest = [];

            let rowIdx = Math.floor(this.nodeIndex / constValue.NodeRow);
            let rowStart = rowIdx * constValue.NodeLedHeight;
            let rowEnd = rowStart + constValue.NodeLedHeight;
            let colIdx = this.nodeIndex % constValue.NodeColumn;
            let colStart = colIdx * constValue.NodeLedWidth;
            let colEnd = colStart + constValue.NodeLedWidth;
            // console.log(`${this.nodeIndex}: ${rowIdx}:${rowStart}:${rowEnd}, ${colIdx}:${colStart}:${colEnd}`);

            for (let r = rowStart; r < rowEnd; r++) {
                const row = led[r];
                dest.push(row.slice(colStart, colEnd));
            }

            this.rawLedStatus = mergeLed(this.rawLedStatus, dest);
        }
    }

    updateRuntimeLedStatus(spaceWidth) {
        // TODO: Add space to ledRaw
        this.runtimeLedStatus = this.rawLedStatus;
    }

    /**
     * Marquee the led
     * @param {number} number Shift value of marquee.
     * Shift to left is number is positive;
     * Shift to right is number is negative.
     */
    marqueeLed(shift) {
        shift = (shift !== undefined) ? shift : 1;
        this.rawLedStatus.forEach(rowLed => {
            marqueeArray(rowLed, shift);
        });
    }

    /**
     * Decode led.
     */
    decodeLedCode(encodeLed) {
        return JSON.parse(encodeLed);
    }

    /**
     * Encode raw led to string
     * @returns {string} Encode led string.
     */
    encodeLed() {
        return JSON.stringify(this.rawLedStatus);
    }

    /**
     * Get Led is enabled or not
     * @param {number} x Row of led
     * @param {number} y Column of led
     * @returns {boolean} Led is enabled or not
     */
    isLedEnabled(x, y) {
        let clr = this.getLedColor(x, y);
        return clr != constValue.Colors.BLACK;
    }

    /**
     * Get Color of Led
     * @param {number} x Row of led
     * @param {number} y Column of led
     * @returns {number} The number of led color
     */
    getLedColor(x, y) {
        let pos = this.getRawPosition(x, y);
        let color = this.rawLedStatus[pos.Row][pos.Column];
        return color;
    }

    /**
     *
     * @param {number} x Row of led
     * @param {number} y Column of led
     * @param {number} color Color of led
     */
    setLed(x, y, color) {
        let pos = this.getRawPosition(x, y);
        this.rawLedStatus[pos.Row][pos.Column] = color == constValue.Colors.NO_CHANGE ?
            this.rawLedStatus[pos.Row][pos.Column] :
            color;
    }

    /**
     *
     * @param {number} x Position of row
     * @param {number} y Position of column
     * @returns {LedPosition} Position of led
     */
    getRawPosition(x, y) {
        let indexX = x - 1;
        let indexY = y - 1;
        if (indexX < 0 || indexY < 0) {
            console.error(`Can not get invalid (x, y) => (${x}, ${y})`);
            return;
        }
        return new LedPosition(indexX, indexY);
    }

    /**
     * Set the led by matrix object
     * @param {object} matrixObj { "type", "matrix", "index": 0, "value": [...] }
     */
    setRawLedByMatrixObject(matrixObj) {
        /**
            {
                "index":0,
                "value":[[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]],
            }
        */

        let index = matrixObj.index;
        let value = matrixObj.value;

        let boardX = Math.floor(index / constValue.NodeCount);
        let startX = boardX * constValue.BoardLedHeight + 1;
        let endX = startX + constValue.BoardLedHeight;

        let boardY = index % constValue.NodeCount;
        let startY = boardY * constValue.BoardLedWidth + 1;
        let endY = startY + constValue.BoardLedWidth;

        let x = 0;
        for (let r = startX; r < endX; r++) {
            let y = 0;
            for (let c = startY; c < endY; c++) {
                let v = value[x][y];
                this.setLed(r, c, v);
                y++;
            }
            x++;
        }
    }

    /**
     * Get all buttons.
     * @return {Array<Array<number>>}
     */
    getAllButtonStatus(buttons) {
        return this.buttonStatus.slice();
    }

    /**
     * Set all status of button.
     * @param {Array<Array<number>>} buttons
     */
    setAllButtonStatus(buttons) {
        this.buttonStatus = buttons.slice();
    }

    /**
     * Get button status
     * @param {number} x Row of button
     * @param {number} y Column of button
     * @returns {number} Status of button 0: disable, 1: enable
     */
    getButtonStatus(x, y) {
        let pos = this.getRawPosition(x, y);
        // Status of button 0: disable, 1: enable
        return this.buttonStatus[pos.Row][pos.Column];
    }

    /**
     * Set button status
     * @param {number} x Row of button
     * @param {number} y Column of button
     * @param {number} status Status of button 0: disable, 1: enable
     */
    setButtonStatus(x, y, status) {
        let pos = this.getRawPosition(x, y);
        this.buttonStatus[pos.Row][pos.Column] = status;
    }

    async renderImage(fileName) {
        let ledData = await jimpToLed(fileName);
        if (ledData != null) {
            this.setRawLedStatus(ledData);
        }
    }
}

module.exports = new ledManager();