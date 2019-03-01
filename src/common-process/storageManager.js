const Store = require('electron-store');
const store = new Store();


class StorageManager {
    clear() {
        store.clear();
    }

    /**
     *
     * @param {Code} code
     */
    saveBlockly(code) {
        let xml = code.generateXml();
        store.set('blockly', xml);
    }

    /**
     *
     * @param {Code} code
     */
    restoreBlockly(code) {
        let xml = store.get('blockly');
        if (xml) {
            code.restoreByXml(xml);
        }
    }

    /**
     *
     * @param {Code} code
     */
    setBlocklyScript(code) {
        let script = code.getGeneratedScript();
        store.set('script', script);
    }

    /**
     * @returns {string}
     */
    getBlocklyScript() {
        return store.get('script');
    }
}

module.exports = new StorageManager();