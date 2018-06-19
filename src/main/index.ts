import { enableLiveReload } from 'electron-compile';
import logger from 'electron-log';
import { Venobo } from './main';

(async () => {
  const isDevMode = process.execPath.match(/[\\/]electron/);

  if (isDevMode) {
    // HMR for React
    enableLiveReload({ strategy: 'react-hmr' });
  }

  // Enable auto updater
  require('update-electron-app')({
    repo: 'marcus-sa/venobo',
    updateInterval: '6 hours',
    logger,
  });

  const venobo = new Venobo(isDevMode);

  await venobo.start();
})();