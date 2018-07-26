import { InjectionToken } from '@angular/core';

import { MetadataConfig } from './interfaces';
import { BaseMetadataProvider } from './providers';

export const USE_METADATA_CONFIG = new InjectionToken<MetadataConfig>('USE_METADATA_CONFIG');

export const USE_METADATA_PROVIDER = new InjectionToken<BaseMetadataProvider>('USE_METADATA_PROVIDER');
