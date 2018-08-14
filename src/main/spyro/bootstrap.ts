import * as path from 'path';

import { Type, FactoryOptions } from './interfaces';
import { Factory } from './factory';

export async function bootstrap(windows: Type<any>[], options: FactoryOptions = {}) {
  if (options.serve) {
    require('electron-reload')(process.cwd(), {
      electron: require(path.join(process.cwd(), 'node_modules', 'electron')),
    });
  }

  const factory = new Factory(windows, options);
  await factory.start();
}
