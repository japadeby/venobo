import { NgModule, ModuleWithProviders } from '@angular/core';

import { BaseTorrentProvider } from './providers/base-torrent.provider';
import { TorrentService } from './torrent.service';
import { USE_TORRENT_PROVIDERS } from './tokens';

@NgModule()
export class TorrentModule {

  public static forRoot(providers: BaseTorrentProvider[]): ModuleWithProviders {
    return {
      ngModule: TorrentModule,
      providers: [
        TorrentService,
        // ProviderUtilsService,
        { provide: USE_TORRENT_PROVIDERS, useValue: providers },
      ],
    };
  }

}
