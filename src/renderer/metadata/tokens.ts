import { InjectionToken } from '@angular/core';

import { BaseMetadataProvider } from './providers';

export const USE_METADATA_CONFIG = new InjectionToken<string>('USE_METADATA_CONFIG');

export const USE_METADATA_PROVIDER = new InjectionToken<BaseMetadataProvider>('USE_METADATA_PROVIDER');
