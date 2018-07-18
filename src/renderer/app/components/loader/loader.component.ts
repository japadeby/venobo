import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
})
export class LoaderComponent {

  @Input() readonly loading: boolean;

  @Input() readonly container: string;

  @Input() readonly spinner: string;

}
