import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { MetadataService } from './metadata.service';
import { USE_METADATA_CONFIG } from './tokens';
import { BaseMetadataProvider } from './providers';

export interface MetadataModuleOptions {
  providers: (BaseMetadataProvider & Provider)[];
  config: {
    key: string;
    api: string;
    backdrop: string;
    still: string;
    poster: string;
    appendToResponse?: string;
    locale?: string;
  };
}

@NgModule()
export class MetadataModule {

  public static forRoot(options: MetadataModuleOptions): ModuleWithProviders {
    return {
      ngModule: MetadataModule,
      providers: [
        ...options.providers,
        MetadataService,
        { provide: USE_METADATA_CONFIG, useValue: options.config },
      ],
    };
  }

}
