import { NgModule, ModuleWithProviders } from '@angular/core';

import { MetadataService } from './metadata.service';
import { MetadataModuleOptions } from './interfaces';
import {
  USE_METADATA_CONFIG,
  USE_METADATA_PROVIDER
} from './tokens';

@NgModule()
export class MetadataModule {

  public static forRoot(options: MetadataModuleOptions): ModuleWithProviders {
    return {
      ngModule: MetadataModule,
      providers: [
        options.provider,
        MetadataService,
        { provide: USE_METADATA_PROVIDER, useExisting: options.provider },
        { provide: USE_METADATA_CONFIG, useValue: options.config },
      ],
    };
  }

}
