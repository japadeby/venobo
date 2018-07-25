import { NgModule, ModuleWithProviders, APP_INITIALIZER, Provider } from '@angular/core';

import { ProviderUtils } from './provider.utils.service';
import { TorrentService } from './torrent.service';
import { JackettService } from './jackett.service';
import { BaseTorrentProvider } from './providers';
import { TORRENT_PROVIDERS } from './tokens';

import { createSourceInstances, createTorrentFactory } from './factory';

@NgModule()
export class TorrentModule {

  public static forRoot(providers: (BaseTorrentProvider & Provider)[]): ModuleWithProviders {
    return {
      ngModule: TorrentModule,
      providers: [
        JackettService,
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
