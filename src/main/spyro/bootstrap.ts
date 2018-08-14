import * as path from 'path';

import { Module, FactoryOptions } from './interfaces';
import { Factory } from './factory';

export async function bootstrap(module: Module, options: FactoryOptions = {}) {
  if (options.serve) {
    require('electron-reload')(process.cwd(), {
      electron: require(path.join(process.cwd(), 'node_modules', 'electron')),
    });
  }

  const factory = new Factory(module, options);
  await factory.start();
}
