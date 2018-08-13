import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { AppService } from './app.service';
import { ElectronService } from './electron.service';
import { ConfigService } from './config.service';

import { createServiceFactory } from './factory';

@NgModule()
export class ServicesModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        ElectronService,
        ConfigService,
        AppService,
        {
          provide: APP_INITIALIZER,
          useFactory: createServiceFactory,
          deps: [ConfigService, AppService],
          multi: true,
        },
      ],
    };
  }

}
