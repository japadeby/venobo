import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { MetadataService, Metadata } from '../../metadata';

@Injectable()
export class TopRatedMoviesResolver implements Resolve<Observable<Metadata[]>> {
  constructor(
    private readonly metadata: MetadataService,
  ) {}

  resolve() {
    return this.metadata.getTopRated('movies');
  }
}
