import { BrowserWindow } from 'electron';
import { Inject, Window, WindowRef, OnBound, SERVE } from '../spyro';
import * as path from 'path';
import * as url from 'url';

// const size = screen.getPrimaryDisplay().workAreaSize;

@Window({
  x: 0,
  y: 0,
  // width: size.width,
  // height: size.height,
  webPreferences: {
    webSecurity: false,
  },
})
export class MainWindow implements OnBound {

  @Inject(WindowRef)
  private readonly windowRef: BrowserWindow;

  @Inject(SERVE)
  private readonly serve: boolean;

  onBound() {
    if (this.serve) {
      this.windowRef.loadURL('http://localhost:4200');
      this.windowRef.webContents.openDevTools();
    } else {
      this.windowRef.loadURL(url.format({
        pathname: path.join(process.cwd(), 'dist', 'renderer', 'index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }
  }

}

