import { AppService } from './app.service';
import { ConfigService } from './config.service';

export function createServiceFactory(
  configService: ConfigService,
  appService: AppService,
) {
  return async () => {
    await configService.load();
    await appService.create();
  };
}
