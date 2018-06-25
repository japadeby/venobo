import { app, ipcMain } from 'electron';

import { Venobo } from './main';
import { ExternalPlayer } from './external-player';
import {
  IPC_READY,
  APP_QUIT,
  CHECK_FOR_EXTERNAL_PLAYER,
  QUIT_EXTERNAL_PLAYER,
  RENDERER_FINISHED_PRELOADING
} from '../events';

export function setupIpcListeners(venobo: Venobo) {
  const externalPlayer = new ExternalPlayer(venobo, '');

  ipcMain.once(IPC_READY, () => {
    venobo.ipcReady = true;
    app.emit(IPC_READY);
  });

  ipcMain.on(APP_QUIT, () => app.quit());

  // Renderer
  ipcMain.on(RENDERER_FINISHED_PRELOADING, () => {
    // Now you can finally show the main window and render UI
    //ipcMain.emit(RENDERER_CONTINUE_LOADING);

    venobo.mainWindow.show();
    venobo.loadingWindow.close();
  });

  /*ipcMain.on(ON_PLAYER_OPEN, () => {

  });

  ipcMain.on(ON_PLAYER_CLOSE, () => {

  });*/

  /**
   * Shell
   */

  /**
   * External media player
   */
  ipcMain.on(CHECK_FOR_EXTERNAL_PLAYER, async (e, path) => {
    const error = await externalPlayer.checkInstall();

    venobo.mainWindow.emit(CHECK_FOR_EXTERNAL_PLAYER, !error);
  });

  ipcMain.on(QUIT_EXTERNAL_PLAYER, () => externalPlayer.kill());
}