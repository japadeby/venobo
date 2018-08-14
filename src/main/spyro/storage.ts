import { EventMetadata, Type, WindowMetadata } from './interfaces';
import { BrowserWindowContainer } from './browser-window-container';

export class MetadataStorage {

  public static readonly browserWindows = new BrowserWindowContainer();
  public static readonly windows = new Set<WindowMetadata>();
  public static readonly events = new Set<EventMetadata>();

  private static findByTarget(
    metadata: Set<any>,
    ctor: Type<any> | Function,
  ): any {
    return Array.from(metadata).find(
      value => value.target === ctor,
    );
  }

  private static filterByTarget(
    metadata: Set<any>,
    ctor: Type<any> | Function,
  ): any[] {
    return Array.from(metadata).filter(
      value => value.target === ctor,
    );
  }

  public static getWindowByType(target: Type<any> | Function): WindowMetadata {
    return this.findByTarget(MetadataStorage.windows, target);
  }

  public static getEventsByType(target: Type<any> | Function): EventMetadata[] {
    return this.filterByTarget(MetadataStorage.events, target);
  }

}
