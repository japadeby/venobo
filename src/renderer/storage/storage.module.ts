import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { StorageService } from './storage.service';
import { USE_STORAGE_OPTIONS } from './tokens';

export function setupStorageFactory(storage: StorageService) {
  return () => storage.create();
}

export interface StorageModuleOptions {
  path: string;
  encoding?: string;
  secret?: string;
  ensureDir?: boolean;
  encrypt?: {
    type?: 'MD5' | 'AES';
    fileContent?: boolean;
    fileName?: boolean;
  };
}

@NgModule()
export class StorageModule {

  public static forRoot(options: StorageModuleOptions): ModuleWithProviders {
    return {
      ngModule: StorageModule,
      providers: [
        StorageService,
        {
          provide: USE_STORAGE_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: setupStorageFactory,
          deps: [StorageService],
          multi: true,
        },
      ],
    };
  }

}
