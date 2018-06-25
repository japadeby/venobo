import { app } from 'electron';

import { MainWindow, LoadingWindow } from './windows';
import { setupIpcListeners } from './ipc';

export class Venobo {

  public shouldQuit: boolean = false;
  //public isReady: boolean = false;
  public ipcReady: boolean = false;
  //public isQuitting: boolean = false;
  public loadingWindow: Electron.BrowserWindow;
  public mainWindow: Electron.BrowserWindow;

  constructor() {
    this.shouldQuit = app.makeSingleInstance(() => null);
  }

  public async start() {
    if (this.shouldQuit) return app.quit();

    process.on('uncaughtException', (err) => {
      console.error(err);
      this.mainWindow.emit('uncaughtError', err);
    });

    app.on('ready', async () => {
      this.mainWindow = await MainWindow.create();

      setupIpcListeners(this);

      this.mainWindow.show();
    });

    app.on('activate', async () => {
      if (!this.mainWindow) {
        this.mainWindow = await MainWindow.create();
      }

      if (!this.loadingWindow) {
        this.loadingWindow = await LoadingWindow.create();
      }
    });

    app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
       app.quit();
     }
    });
  }

}