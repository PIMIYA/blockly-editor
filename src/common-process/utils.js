const _ = require('underscore');

const LedPosition = require('./modules/LedPosition');
const constValue = require('./constValue');

class Utils {
    constructor() {
        this.orderedColors = [
            constValue.Colors.BLACK,
            constValue.Colors.WHITE,
            constValue.Colors.RED,
            constValue.Colors.ORANGE,
            constValue.Colors.YELLOW,
            constValue.Colors.GREEN,
            constValue.Colors.BLUE,
            constValue.Colors.INDIGO,
            constValue.Colors.PURPLE,
        ];
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     *
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    rgb2Number(r, g, b) {
        return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
    }

    rgb2Hex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    /**
     *
     * @param {number} nodeIndex
     * @param {number} x
     * @param {number} y
     * @returns {LedPosition}
     */
    nodePosTolMainPos(nodeIndex, x, y) {
        if (nodeIndex === undefined || x === undefined || y === undefined) {
            return;
        }

        let pos = new LedPosition();
        pos.BoardRow = x;
        pos.BoardColumn = y;

        let nodeX = Math.floor(nodeIndex / constValue.NodeColumn);
        let nodeY = nodeIndex % constValue.NodeColumn;

        let orgX = nodeX * constValue.BoardLedHeight;
        let orgY = nodeY * constValue.BoardLedWidth;
        pos.Row = orgX + x;
        pos.Column = orgY + y;

        return pos;
    }

    /**
     * Get next color
     * @param {string} currentColo Hex string of color.
     * @returns {string} Next hex string of color
     */
    nextColor(currentColor) {
        let index = this.orderedColors.indexOf(currentColor);
        index = ++index % this.orderedColors.length;
        return this.orderedColors[index];
    }

    /**
     *
     * @param {string} colorHex
     * @returns {number}
     */
    hexToNumber(colorHex) {
        colorHex = `0x${colorHex.substr(1)}`;
        let components = {
            r: (colorHex & 0xff0000),
            g: (colorHex & 0x00ff00),
            b: (colorHex & 0x0000ff)
        };
        return components.r + components.g + components.b;
    }

    /**
     *
     * @param {Array<string>} data
     * @returns {Uint32Array}
     */
    hexToUint32Array(data) {
        let result = new Uint32Array(data.length);
        data.forEach((element, index) => {
            result[index] = this.hexToNumber(element);
        });

        return result;
    }

    /**
     *
     * @param {object} image
     * @returns {Uint32Array}
     */
    jimpImageToUint32Array(image) {
        let u = this;
        let length = image.bitmap.width * image.bitmap.height;
        let result = new Uint32Array(length);
        let index = 0;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            let r = this.bitmap.data[idx];
            let g = this.bitmap.data[idx + 1];
            let b = this.bitmap.data[idx + 2];
            // let a = this.bitmap.data[idx + 3];
            // console.log(`${x}, ${y}: ${r} ${g} ${b}`);
            result[index++] = u.rgb2Number(r, g, b);
        });

        return result;
    }

    /**
     *
     * @param {object} image
     * @returns {Array<Array<string>>}
     */
    jimpImageToLedStatus(image) {
        let u = this;
        let result = [];
        let index = 0;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            let r = this.bitmap.data[idx];
            let g = this.bitmap.data[idx + 1];
            let b = this.bitmap.data[idx + 2];
            // let a = this.bitmap.data[idx + 3];
            // console.log(`${x}, ${y}: ${r} ${g} ${b}`);
            result.push(u.rgb2Hex(r, g, b));
        });

        return _.chunk(result, constValue.TotalLedWidth);
    }

    /************************************************************************+*/

    colorWheel(pos) {
        pos = 255 - pos;
        if (pos < 85) {
            return this.rgb2Hex(255 - pos * 3, 0, pos * 3);
        } else if (pos < 170) {
            pos -= 85;
            return this.rgb2Hex(0, pos * 3, 255 - pos * 3);
        } else {
            pos -= 170;
            return this.rgb2Hex(pos * 3, 255 - pos * 3, 0);
        }
    }

    dumpLed(led, ledHeight, removeComma) {
        removeComma = (typeof removeComma === 'undefined') ? true : false;
        let rowIndex = 0;
        led.forEach(element => {
            console.log(removeComma ?
                element.toString().replace(/,+/g, '') :
                element.toString());
            rowIndex++;
            if (rowIndex % ledHeight == 0) {
                console.log('~~~');
            }
        });
    }

    rainbowLed(w, h) {
        let c = w * h;
        let led = [];
        for (let index = 0; index < c; index++) {
            led.push(this.colorWheel(index % 256));
        }

        return _.chunk(led, constValue.TotalLedWidth);
    }

    iterateLed(w, h) {
        let c = w * h;
        let led = [];
        for (let index = 0; index < c; index++) {
            let a = Math.floor(index / constValue.BoardLedWidth);
            let b = a % constValue.NodeColumn;
            let c = Math.floor(a / constValue.TotalLedHeight);
            let clr = b + c * constValue.NodeColumn;
            led.push('#' + `${clr}`.padStart(6, '0'));
        }
        return _.chunk(led, constValue.TotalLedWidth);
    }

    reverseOdd(rawLed) {
        if (!_.isArray(rawLed)) {
            return rawLed;
        }

        return _.map(rawLed, function ( /** @type {Array} */ element, /** @type {number} */ index) {
            // console.log(index, element);
            if (index % 2 == 0) {
                // even
                return element;
            } else {
                // odd
                return element.reverse();
            }
        })
    }
}

module.exports = new Utils();
