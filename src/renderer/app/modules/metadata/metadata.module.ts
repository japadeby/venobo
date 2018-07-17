import { NgModule, ModuleWithProviders } from '@angular/core';
import { MetadataService } from './metadata.adapter.service';
import { USE_METADATA_CONFIG } from './tokens';

export interface MetadataModuleOptions {
  key: string;
  api: string;
  locale?: string;
}

@NgModule()
export class MetadataModule {

  public static forRoot(config: MetadataModuleOptions): ModuleWithProviders {
    return {
      ngModule: MetadataModule,
      providers: [
        MetadataService,
        { provide: USE_METADATA_CONFIG, useValue: config },
      ],
    };
  }

}
