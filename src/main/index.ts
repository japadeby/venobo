import logger from 'electron-log';
import { Venobo } from './main';

(async () => {

  // Enable auto updater
  require('update-electron-app')({
    repo: 'marcus-sa/venobo',
    updateInterval: '6 hours',
    logger,
  });

  const venobo = new Venobo();

  await venobo.start();
})();