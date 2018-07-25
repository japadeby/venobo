import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MetadataUnion } from '../../../metadata';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
})
export class MediaComponent implements OnInit {

  protected media: MetadataUnion;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.media = this.route.snapshot.data.media;
  }

}
