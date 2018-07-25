import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Metadata } from '../../../metadata';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  data!: {
    topRatedMovies:  Metadata[];
    popularMovies: Metadata[];
  };

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.data = this.route.snapshot.data as any;
  }

}
