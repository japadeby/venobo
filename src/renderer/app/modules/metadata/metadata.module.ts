import { NgModule, ModuleWithProviders } from '@angular/core';

import { MetadataService } from './metadata.service';
import { USE_METADATA_CONFIG } from './tokens';
import { MetadataModuleOptions } from './interfaces';

@NgModule()
export class MetadataModule {

  public static forRoot(options: MetadataModuleOptions): ModuleWithProviders {
    return {
      ngModule: MetadataModule,
      providers: [
        options.providers,
        MetadataService,
        { provide: USE_METADATA_CONFIG, useValue: options.config },
      ],
    };
  }

}
