import { BrowserWindowConstructorOptions } from 'electron';
import { injectable } from 'inversify';

import { MetadataStorage } from '../storage';

export function Window(options: BrowserWindowConstructorOptions = {}): ClassDecorator {
  return (target: object) => {
    MetadataStorage.window.add({
      target: target.constructor,
      ...options,
    });

    return injectable()(target);
  };
}
