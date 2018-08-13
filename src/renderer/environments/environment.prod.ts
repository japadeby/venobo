import { BaseEnvironment } from './base.environment';

export class AppConfig extends BaseEnvironment {
  public static production = true;
  public static environment = 'PROD';
}
