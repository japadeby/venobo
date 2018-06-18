import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import {startIpc} from './ipc';

export class Venobo {

    public shouldQuit: boolean = false;
    public isReady: boolean = false;
    public ipcReady: boolean = false;
    public isQuitting: boolean = false;
    public mainWindow: Electron.BrowserWindow;

    constructor(public readonly isDevMode: RegExpMatchArray | null) {
        this.shouldQuit = app.makeSingleInstance(this.onAppOpen);
        if (this.shouldQuit) app.quit();
    }

    public async start() {
        app.setPath('userData', 'some path');
        app.setPath('temp', 'some path');

        setTimeout(() => this.delayedInit(), 5000);

        process.on('uncaughtException', (err) => {
            console.error(err);
            // Main.dispatch('uncaughtError', 'main', err);
        });

        /*await Promise.all([
            new Promise(resolve => {
                return app.on('ready', resolve);
            })
        ]);*/

        startIpc(this);
    }

    private delayedInit() {

    }

    private onAppOpen() {

    }

}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let shouldQuit: boolean = false;
let isReady: boolean = false;
let mainWindow: Electron.BrowserWindow;

const createWindow = async () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        titleBarStyle: 'hiddenInset',
        useContentSize: true,
    });

    // and load the index.html of the app.
    const startUrl = url.format({
        pathname: path.join(__dirname, '..', 'index.html'),
        protocol: 'file:',
        slashes: true,
    });
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    if (isDevMode) {
        await installExtension(REACT_DEVELOPER_TOOLS);
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!mainWindow) {
        createWindow();
    }
});

console.log('hello from main process');

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
