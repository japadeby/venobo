import { enableLiveReload } from 'electron-compile';
import { Venobo } from './main';

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({ strategy: 'react-hmr' });
}

(async () => {
  const venobo = new Venobo(isDevMode);

  await venobo.start();
})();