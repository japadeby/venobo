import { app, BrowserWindow } from 'electron';
import { Container } from 'inversify';

import { BrowserWindowContainer } from './browser-window-container';
import { Type, FactoryOptions, OnBound } from './interfaces';
import { MetadataStorage } from './storage';
import { SERVE, WindowRef } from './tokens';

export class Factory {

  private readonly browserWindowContainer = new BrowserWindowContainer();

  private readonly container = new Container({
    autoBindInjectable: true,
    defaultScope: 'Singleton',
  });

  constructor(
    private readonly windows: Type<any>[],
    private readonly options: FactoryOptions,
  ) {}

  public async start() {
    this.bind();

    app.on('ready', async () => {
      await this.createWindows();
    });

    app.on('activate', async () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.browserWindowContainer.size !== this.windows.length) {
        await this.createWindows();
      }
    });

    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (this.options.quitAppOnAllWindowsClosed && process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  private async createWindows() {
    await Promise.all(
      this.windows.map(async (window) => {
        const metadata = MetadataStorage.getWindowByType(window);
        const browserWindow = new BrowserWindow(metadata);

        this.container.bind(WindowRef)
          .toConstantValue(browserWindow)
          .whenInjectedInto(<any>window);

        this.browserWindowContainer.set(
          window.constructor,
          browserWindow,
        );

        const instance = this.container.get(window);
        if (instance.onBound) await (instance as OnBound).onBound();
      })
    );
  }

  private bind() {
    this.container.bind<boolean>(SERVE).toConstantValue(this.options.serve);
  }

}
