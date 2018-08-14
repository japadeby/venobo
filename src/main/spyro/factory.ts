import { app, BrowserWindow } from 'electron';
import { Container } from 'inversify';

import { BrowserWindowContainer } from './browser-window-container';
import { Module, FactoryOptions } from './interfaces';
import { MetadataStorage } from './storage';
import { SERVE, WindowRef } from './tokens';
import { EventManager } from './managers';

export class Factory {

  private readonly container = new Container({
    autoBindInjectable: true,
    defaultScope: 'Singleton',
  });

  constructor(
    private readonly module: Module,
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
      if (this.browserWindowContainer.size !== this.module.windows.length) {
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
      this.module.windows.map(async (window) => {
        const metadata = MetadataStorage.getWindowByType(window.constructor);
        const browserWindow = new BrowserWindow(metadata);

        this.container.bind(WindowRef)
          .toConstantValue(browserWindow)
          .whenInjectedInto(<any>window);

        MetadataStorage.browserWindows.set(
          window.constructor,
          browserWindow,
        );

        const eventManager = new EventManager(this.container, window);
        await eventManager.start();
      })
    );
  }

  private bind() {
    this.container.bind<boolean>(SERVE).toConstantValue(this.options.serve);
  }

}
