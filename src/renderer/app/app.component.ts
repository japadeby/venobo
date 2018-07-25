import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  viewActive: boolean = false;

  onViewActivate() {
    this.viewActive = true;
  }

  onViewDeactivate() {
    this.viewActive = false;
  }

}
