import { forwardRef, NgModule } from '@angular/core';

import { ObservableUtils } from './observable.utils.service';
import { PromiseUtils } from './promise.utils.service';
import { Utils } from './utils.service';

@NgModule({
  providers: [
    Utils,
    PromiseUtils,
    ObservableUtils,
  ],
})
export class UtilsModule {}
