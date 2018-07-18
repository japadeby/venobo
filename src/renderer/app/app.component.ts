import { Component, OnInit } from '@angular/core';

import { AppService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(protected readonly appService: AppService) {}

  async ngOnInit() {
    await this.appService.init();
  }

}
