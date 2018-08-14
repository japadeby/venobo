import { Container } from 'inversify';

import { OnBound, Type } from '../interfaces';
import { MetadataStorage } from '../storage';
import { METADATA_TYPE, MODULE } from '../constants';

// @TODO: Clean up
export class EventManager {

  constructor(
    private readonly container: Container,
    private readonly component: Type<any>,
  ) {}

  public async start() {
    const instance = this.container.get(this.component);
    const events = MetadataStorage.getEventsByType(this.component);
    const type = Reflect.getMetadata(METADATA_TYPE, this.component);

    if (instance.onBound) await (instance as OnBound).onBound();

    if (type === MODULE.WINDOW) {
      Array.from(events)
        .forEach(event => {
          const windowRef = MetadataStorage.browserWindows.get(this.component.constructor);

          windowRef.on(<any>event.name, (...args: any[]) => {
            return (<any>instance)[event.method](...args);
          });
        });
    }
  }

}
