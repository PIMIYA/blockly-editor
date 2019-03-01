const {
    ipcMain
} = require('electron');
const Store = require('electron-store');
const store = new Store();

ipcMain.on('storage-save-blockly', (event, blockly) => {
    store.set('blockly', blockly);
});

ipcMain.on('storage-restore-blockly', (event) => {
    let blockly = store.get('blockly');
    event.sender.send('storage-restore-blockly', blockly);
});