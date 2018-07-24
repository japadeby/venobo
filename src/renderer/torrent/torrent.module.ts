import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';

import { ProviderUtils } from './provider.utils.service';
import { TorrentService } from './torrent.service';
import { BaseTorrentProvider } from './providers';
import { TORRENT_PROVIDERS } from './tokens';

import { createSourceInstances, createTorrentFactory } from './factory';

@NgModule()
export class TorrentModule {

  public static forRoot(providers: BaseTorrentProvider[]): ModuleWithProviders {
    return {
      ngModule: TorrentModule,
      providers: [
        TorrentService,
        ProviderUtils,
        providers,
        {
          useFactory: createSourceInstances,
          provide: TORRENT_PROVIDERS,
          deps: providers,
        },
        {
          useFactory: createTorrentFactory,
          provide: APP_INITIALIZER,
          deps: [TorrentService],
          multi: true,
        }
      ],
    };
  }

}
