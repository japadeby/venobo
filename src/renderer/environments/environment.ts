import { BaseEnvironment } from './base.environment';

export class AppConfig extends BaseEnvironment {
  public static production = false;
  public static environment = 'LOCAL';
}
