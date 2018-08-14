import { BrowserWindowConstructorOptions } from 'electron';

import { Target } from '../target.interface';

export interface WindowMetadata extends BrowserWindowConstructorOptions, Target {}
