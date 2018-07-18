import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { BaseTorrentProvider } from './providers';
import { TorrentService } from './torrent.service';
import { TORRENT_PROVIDERS } from './tokens';

export function createSourceInstances(providers: Type<any>[]) {
  return (http: HttpClient) => providers.map(
    Provider => new Provider(http)
  );

  /*console.log(instances);
  return instances;*/
}

@NgModule()
export class TorrentModule {

  public static forRoot(providers: Type<any>[]): ModuleWithProviders {
    return {
      ngModule: TorrentModule,
      imports: [HttpClientModule],
      providers: [
        ...providers,
        TorrentService,
        {
          provide: TORRENT_PROVIDERS,
          multi: true,
          deps: [HttpClient], // providers,
          useFactory: createSourceInstances(providers),
        },
      ],
    };
  }

}
