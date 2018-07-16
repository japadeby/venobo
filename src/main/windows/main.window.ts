import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import isDevMode from 'electron-is-dev';
import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

export namespace MainWindow {

  export async function create() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: isDevMode,
      titleBarStyle: 'hiddenInset',
      useContentSize: true,
      webPreferences: {
        webSecurity: false,
      },
    });

    if (isDevMode) {
      mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    } else {
      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, '..', 'index.html'),
          protocol: 'file:',
          slashes: true,
        })
      );
    }

    if (isDevMode) {
      await installExtension(REACT_DEVELOPER_TOOLS);
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    return mainWindow;
  }

}