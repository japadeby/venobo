import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  protected hoverActive = false;

  protected hoverDetails = () => this.hoverActive = !this.hoverActive;

  protected quitApp = () => ipcRenderer.emit('appQuit');

}
