import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { MetadataService } from '../../modules/metadata/index';

@Injectable()
export class HomeResolver implements Resolve<Observable<string>> {
  constructor(private readonly metadataService: MetadataService) {}

  resolve() {
    return of('test').pipe(delay(2000));
  }
}
