import { Target } from '../target.interface';
// import { MODULE } from '../../constants';

export interface EventMetadata extends Target {
  // type: MODULE;
  method: string;
  name: string;
}
