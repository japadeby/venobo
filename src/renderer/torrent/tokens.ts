import { InjectionToken } from '@angular/core';

import { BaseTorrentProvider } from './providers';

export const TORRENT_PROVIDERS = new InjectionToken<BaseTorrentProvider[]>('TORRENT_PROVIDERS');
