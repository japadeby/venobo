import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { MetadataService, Metadata } from '../../metadata';

@Injectable()
export class PopularMoviesResolver implements Resolve<Observable<Metadata[]>> {
  constructor(
    private readonly metadata: MetadataService,
  ) {}

  resolve() {
    return this.metadata.getPopular('movies');
  }
}
