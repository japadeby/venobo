import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MetadataService, MetadataUnion } from '../../../metadata';

@Injectable()
export class MediaResolver implements Resolve<Observable<MetadataUnion>> {

  constructor(
    private readonly metadata: MetadataService,
  ) {}

  resolve({ params: { id, type } }: ActivatedRouteSnapshot) {
    return this.metadata.getById(id, type);
  }
}
