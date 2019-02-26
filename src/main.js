const {
    app,
    BrowserWindow
} = require('electron');

const debug = /--debug/.test(process.argv[2]);

if (process.mas) app.setName('Blockly Editor');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

function makeSingleInstance() {
    if (process.mas) return;

    app.requestSingleInstanceLock();
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
}

function initialize() {
    makeSingleInstance();

    function createWindow() {
        const windowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName()
        };

        // Create the browser window.
        mainWindow = new BrowserWindow(windowOptions);

        // and load the index.html of the app.
        mainWindow.loadFile('./views/index.html');

        // Open the DevTools.
        mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        });
    }

    if (debug) {
        mainWindow.webContents.openDevTools();
        mainWindow.maximize();
        require('devtron').install();
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });
}

initialize();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.