import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

export namespace LoadingWindow {

  export async function create() {
    const loadingWindow = new BrowserWindow({
      width: 800,
      height: 600,
      titleBarStyle: 'hiddenInset',
      useContentSize: true,
    });

    const startUrl = url.format({
      pathname: path.join(__dirname, '..', '..', '..', 'static', 'loading.html'),
      protocol: 'file:',
      slashes: true,
    });

    loadingWindow.loadURL(startUrl);

    return loadingWindow;
  }

}