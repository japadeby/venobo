import { Type, WindowMetadata } from './interfaces';

export class MetadataStorage {

  public static readonly window = new Set<WindowMetadata>();

  private static getByTarget(
    metadata: Set<any>,
    ctor: Function,
  ): any {
    return Array.from(metadata).find(
      value => value.target === ctor,
    );
  }

  public static getWindowByType(target: Type<any>): WindowMetadata {
    return this.getByTarget(MetadataStorage.window, target.constructor);
  }

}
