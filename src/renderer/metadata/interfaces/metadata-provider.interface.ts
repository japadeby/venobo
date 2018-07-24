import { Provider } from '@angular/core';

import { BaseMetadataProvider } from '../providers';

export type MetadataProvider = (BaseMetadataProvider & Provider);
