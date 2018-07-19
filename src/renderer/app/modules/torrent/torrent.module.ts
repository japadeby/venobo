import { NgModule, ModuleWithProviders, Type } from '@angular/core';

import { ProviderUtils } from './provider.utils.service';
import { TorrentService } from './torrent.service';
import { BaseTorrentProvider } from './providers';
import { TORRENT_PROVIDERS } from './tokens';

export function createSourceInstances(...instances: Type<any>[]) {
  return instances;
}

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
      ],
    };
  }

}
