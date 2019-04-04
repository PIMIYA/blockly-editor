const {
    ipcRenderer
} = require('electron');

const utils = require('../common-process/utils');

const INTERVAL = 300;
const RGB_REGEX = /rgb\((\d+), (\d+), (\d+)\)/;

let _intervalId = null;
let _w = 0;
let _h = 0;
/** @type {number} Mode 0: free, 1: art, 2: blockly */
let _mode = 2;
/** @type {number} State 0: stop, 1: start */
let _state = -1;

let btnBackHome = document.getElementById('btnBackHome');
let btnBlockly = document.getElementById('btnBlockly');

// let btnMode = document.getElementById('btnMode');
let btnStart = document.getElementById('btnStart');
let btnStop = document.getElementById('btnStop');
let btnReset = document.getElementById('btnReset');

let spanStatus = document.getElementById('status');

let _ledButtons = {};

function switchMode() {
    if (_mode == 0) {
        _mode = 2;
    } else if (_mode == 2) {
        _mode = 0;
    } else {
        _mode = 0;
    }

    // force to blockly
    _mode = 2;

    updateStatueInformation(_mode, _state);
}

function updateStatueInformation(mode, state) {
    const textMode = ['Free', 'Art', 'Blockly'];
    const textState = ['暫停中', '執行中'];

    spanStatus.innerHTML = `Mode: ${textMode[mode]}, 狀態: ${textState[state]}`;
}

function onLedButtonClick(e) {
    let targetElement = e.target || e.srcElement;

    let v = targetElement.getAttribute('value');
    let x = v.split('_')[0];
    let y = v.split('_')[1];
    let request = null;
    let cmd = null;

    switch (_mode) {
        case 0: // free
            let id = targetElement.getAttribute('id');
            let t = document.getElementById(id);
            let style = window.getComputedStyle(t);
            let rgb = RGB_REGEX.exec(style.backgroundColor);
            let r = parseInt(rgb[1]),
                g = parseInt(rgb[2]),
                b = parseInt(
                    rgb[3]);
            let curClr = utils.rgb2Hex(r, g, b);
            let nextClr = utils.nextColor(curClr);

            cmd = 'setLed';
            request = {
                x: x,
                y: y,
                color: nextClr
            };
            break;

        case 2: // blockly
            cmd = 'triggerButton';
            request = {
                x: x,
                y: y,
            };
            break;
    }

    // console.log(cmd, request);
    ipcRenderer.send('simulate-led', cmd, request);
}

function updateButton(data) {
    // console.log(data);
    for (let rIdx = 1; rIdx <= _h; rIdx++) {
        for (let cIdx = 1; cIdx <= _w; cIdx++) {
            let id = `led_${rIdx}_${cIdx}`;
            let btn = _ledButtons[id];
            if (btn) {
                if (data.led != null) {
                    btn.style.backgroundColor = data.led[rIdx - 1][cIdx - 1];
                }

                if (data.button != null) {
                    btn.innerHTML = data.button[rIdx - 1][cIdx - 1];
                }
            }
        }
    }
}

ipcRenderer.on('simulator-controller', (event, cmd, args) => {
    switch (cmd) {
        case 'stop':
            _state = 0;

            if (_intervalId) {
                clearInterval(_intervalId);
            }
            break;

        case 'start':
            _state = 1;

            _intervalId = setInterval(() => {
                ipcRenderer.send('simulate-led', 'getStatus');
            }, INTERVAL);
            break;

        case 'reset':
            ipcRenderer.send('simulate-led', 'getStatus');
            break;

        case 'loadScript':
            // console.log(args);
            break;
    }

    updateStatueInformation(_mode, _state);
});

ipcRenderer.on('simulate-led', (event, cmd, response) => {
    // console.log(cmd, response);
    switch (cmd) {
        case 'getStatus':
            updateButton(response);
            break;
    }
});

ipcRenderer.on('simulate-ready', (event, arg) => {
    // console.log(arg);
    _w = arg.TotalLedWidth;
    _h = arg.TotalLedHeight;
    let ledDiv = document.getElementById('ledContent');
    let container = ledDiv.querySelector('div.container-led');
    container.style.cssText = `grid-template-columns: repeat(${_w}, 1fr);`;
    for (let rIdx = 1; rIdx <= _h; rIdx++) {
        for (let cIdx = 1; cIdx <= _w; cIdx++) {
            let btn = document.createElement('button');
            btn.classList.add('led');
            let id = `led_${rIdx}_${cIdx}`;
            btn.setAttribute('id', id);
            btn.setAttribute('value', `${rIdx}_${cIdx}`);
            btn.onclick = onLedButtonClick;

            _ledButtons[id] = btn;
            container.appendChild(btn);
        }
    }

    ipcRenderer.send('simulator-controller', 'stop');
    ipcRenderer.send('simulator-controller', 'loadScript');
    ipcRenderer.send('simulate-led', 'getStatus');
});

document.addEventListener('DOMContentLoaded', () => {
    btnBackHome.addEventListener('click', (event) => {
        window.location.assign('../index.html');
    });

    btnBlockly.addEventListener('click', (event) => {
        window.location.assign('../blockly/index.html')
    });

    // btnMode.addEventListener('click', (event) => {
    //     switchMode();
    // });

    btnStart.addEventListener('click', (event) => {
        ipcRenderer.send('simulator-controller', 'start');
    });

    btnStop.addEventListener('click', (event) => {
        ipcRenderer.send('simulator-controller', 'stop');
    });

    btnReset.addEventListener('click', (event) => {
        ipcRenderer.send('simulator-controller', 'reset');
    });

    ipcRenderer.send('simulate-ready');
});