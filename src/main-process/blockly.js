const fs = require('fs');
const {
    ipcMain,
    dialog
} = require('electron');

ipcMain.on('script-save-dialog', (event, scriptContent) => {
    const options = {
        title: 'Save an Script',
        filters: [{
            name: 'script',
            extensions: ['js']
        }]
    };

    dialog.showSaveDialog(options, (filename) => {
        if (!filename) {
            return;
        }

        fs.writeFile(filename, scriptContent, function (err) {
            if (err) {
                event.sender.send('saved-script', {
                    err: err
                });
                return;
            }

            event.sender.send('saved-script', {
                err: null
            });
        });
    });
});

ipcMain.on('xml-export-dialog', (event, xml) => {
    const options = {
        title: 'Save an XML',
        filters: [{
            name: 'blockly',
            extensions: ['xml']
        }]
    };

    dialog.showSaveDialog(options, (filename) => {
        if (!filename) {
            return;
        }

        fs.writeFile(filename, xml, function (err) {
            if (err) {
                event.sender.send('export-xml', {
                    err: err
                });
                return;
            }

            event.sender.send('export-xml', {
                err: null
            });
        });
    });
});

ipcMain.on('xml-import-dialog', (event) => {
    const options = {
        title: 'Open an XML',
        filters: [{
            name: 'blockly',
            extensions: ['xml']
        }]
    };

    dialog.showOpenDialog(options, (filenames) => {
        if (!filenames) {
            return;
        }

        fs.readFile(filenames[0], function (err, data) {
            if (err) {
                event.sender.send('import-xml', {
                    err: err
                });
                return;
            }

            event.sender.send('import-xml', {
                err: null,
                data: data
            });
        });
    });
});