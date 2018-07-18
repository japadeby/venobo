import { NgModule } from '@angular/core';

import { AppService } from './app.service';
import { ElectronService } from './electron.service';
// import { ConfigService } from './config.service';

@NgModule({
  providers: [AppService, ElectronService/*, ConfigService*/],
})
export class ServicesModule {}
