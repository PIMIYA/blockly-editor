const fs = require('fs');
const {
    ipcMain,
    dialog
} = require('electron');

ipcMain.on('save-dialog', (event, scriptContent) => {
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
                event.sender.send('saved-file', {
                    err: err
                });
                return;
            }

            event.sender.send('saved-file', {
                err: null
            });
        });
    });
});