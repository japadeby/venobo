import { forwardRef, NgModule } from '@angular/core';

import { AppService } from './app.service';
import { ElectronService } from './electron.service';
import { UtilsModule } from './utils';
// import { ConfigService } from './config.service';

@NgModule({
  imports: [UtilsModule],
  providers: [AppService, ElectronService/*, ConfigService*/],
})
export class ServicesModule {}
