import { Type } from './type.interface';

export interface Module {
  windows?: Type<any>[];
  providers?: Type<any>[];
}
