import { BrowserWindowConstructorOptions } from 'electron';
import { injectable } from 'inversify';

import { METADATA_TYPE, MODULE } from '../constants';
import { MetadataStorage } from '../storage';

export function Window(options: BrowserWindowConstructorOptions = {}): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(METADATA_TYPE, MODULE.WINDOW, target);

    MetadataStorage.windows.add({
      target: target.constructor,
      ...options,
    });

    return injectable()(target);
  };
}
