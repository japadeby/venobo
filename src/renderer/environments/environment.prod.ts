import { BaseEnvironment } from './base.environment';

export abstract class AppConfig extends BaseEnvironment {
  public static production = true;
  public static environment = 'PROD';
}
