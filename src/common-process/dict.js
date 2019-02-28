const Buffer = require('buffer').Buffer;

let base64 = {
    /**
     * Encode to base64
     * @param {string} value
     * @returns {string}
     */
    encode: function (value) {
        if (typeof value != String)
            value = value.toString();
        return Buffer.from(value).toString('base64');
    },

    /**
     * Decode from base64
     * @param {string} base64String
     * @returns {string}
     */
    decode: function (base64String) {
        return Buffer.from(base64String, 'base64').toString();
    }
};

class Dict {
    constructor() {
        this._cachedObjects = {};
    }

    clear() {
        this._cachedObjects = {};
    }

    existsById(id) {
        return this._cachedObjects[id] != undefined;
    }

    exists(key) {
        let id = base64.encode(key);
        return this.existsById(id);
    }

    addOrUpdate(key, value) {
        let id = base64.encode(key);
        this._cachedObjects[id] = value;
    }

    get(key) {
        let id = base64.encode(key);
        if (this.existsById(id)) {
            return this._cachedObjects[id];
        }

        return null;
    }

    del(key) {
        let id = base64.encode(key);
        if (this.existsById(id)) {
            delete this._cachedObjects[id];
        }
    }
}

module.exports = Dict;