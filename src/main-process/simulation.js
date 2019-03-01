const {
    ipcMain
} = require('electron');

const storageManager = require('../common-process/storageManager');
const constValue = require('../common-process/constValue');
const ledManager = require('../common-process/ledManager');
ledManager.init();

const runner = require('../common-process/simulationRunner');

ipcMain.on('simulator-controller', (event, cmd) => {
    switch (cmd) {
        case 'start':
            runner.start();
            event.sender.send('simulator-controller', cmd);
            break;
        case 'stop':
            runner.stop();
            event.sender.send('simulator-controller', cmd);
            break;
        case 'reset':
            runner.resetAll();
            event.sender.send('simulator-controller', cmd);
            break;
        case 'loadScript':
            runner.importScript(storageManager.getBlocklyScript());
            event.sender.send('simulator-controller', cmd, storageManager.getBlocklyScript());
            break;
    }
});

ipcMain.on('simulate-ready', (event) => {
    event.sender.send('simulate-ready', constValue);
});

ipcMain.on('simulate-led', (event, cmd, request) => {
    switch (cmd) {
        case 'getLedStatus':
            event.sender.send('simulate-led', cmd, ledManager.getRawLedStatus());
            break;
        case 'setLed':
            ledManager.setLed(request.x, request.y, request.color);
            event.sender.send('simulate-led', 'getLedStatus', ledManager.getRawLedStatus());
            break;
    }
});