import { InjectionToken } from '@angular/core';

import { StorageModuleOptions } from './storage.module';

export const USE_STORAGE_OPTIONS = new InjectionToken<StorageModuleOptions>('USE_STORAGE_OPTIONS');
