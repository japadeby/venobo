import { NgModule, ModuleWithProviders, Type } from '@angular/core';

import { BaseTorrentProvider } from './providers';
import { TorrentService } from './torrent.service';
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
        providers,
        TorrentService,
        {
          provide: TORRENT_PROVIDERS,
          // multi: true,
          deps: providers,
          useFactory: createSourceInstances,
        },
      ],
    };
  }

}
