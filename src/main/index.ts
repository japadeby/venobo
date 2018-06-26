import { enableLiveReload } from 'electron-compile';
import isDevMode from 'electron-is-dev';
import logger from 'electron-log';
import { Venobo } from './main';

(async () => {
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

  const venobo = new Venobo();

  await venobo.start();
})();