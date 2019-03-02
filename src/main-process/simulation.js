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
    let ledStatus, btnStatus, response;

    switch (cmd) {
        case 'getStatus':
            ledStatus = ledManager.getRawLedStatus();
            btnStatus = ledManager.getAllButtonStatus();
            response = {
                led: ledStatus,
                button: btnStatus
            };

            event.sender.send('simulate-led', 'getStatus', response);
            break;

        case 'setLed':
            ledManager.setLed(request.x, request.y, request.color);

            ledStatus = ledManager.getRawLedStatus();
            response = {
                led: ledStatus,
                button: null
            };

            event.sender.send('simulate-led', 'getStatus', response);
            break;

        case 'triggerButton':
            let status = ledManager.getButtonStatus(request.x, request.y);
            let changeTo = status == 1 ? 0 : 1;
            ledManager.setButtonStatus(request.x, request.y, changeTo);

            btnStatus = ledManager.getAllButtonStatus();
            response = {
                led: null,
                button: btnStatus
            };

            event.sender.send('simulate-led', 'getStatus', response);
            break;
    }
});