const requireFromString = require('require-from-string');

const constValue = require('./constValue');
const runtimeValue = require('./runtimeValue');
const ledManager = require('./ledManager');

const INTERVAL = 50;
let _intervalId = null;
let _locked = false;
let _paused = false;

class Runner {
    constructor() {
        this.lastUpdateTime = Date.now();
        this.logicer = null;
    }

    loop() {
        if (_paused || _locked) {
            return;
        }

        _locked = true;

        let elapsed = Date.now() - this.lastUpdateTime;
        this.runBlockyMode(elapsed);
        this.lastUpdateTime = Date.now();

        _locked = false;
    }

    runBlockyMode(elapsed) {
        // console.log(`running ${elapsed}`);
        runtimeValue.addElapsed(elapsed);

        if (this.logicer) {
            this.logicer.run(constValue, runtimeValue, ledManager);
        }
    }

    start() {
        console.log('Start loop');
        _paused = false;

        if (!_intervalId) {
            _intervalId = setInterval(() => this.loop(), INTERVAL);
        }
    }

    stop() {
        console.log('Stop loop');
        _paused = true;
    }

    resetAll() {
        ledManager.resetAll();
    }

    importScript(content) {
        if (!content) {
            return;
        }

        // content = `var idx;
        // function run(constValue ,runtimeValue, ledManager) {
        //     idx = idx == undefined ?
        //      0 :
        //      idx;
        //   idx = idx % 8;
        //   ledManager.renderImage('D:/workspace/blockly-editor/res/full-'+idx+'.jpg');
        //   idx++;
        // }

        // module.exports = {
        //     run: run
        // };
        // `;
        console.log('load');
        this.logicer = requireFromString(content);
    }
}

module.exports = new Runner();