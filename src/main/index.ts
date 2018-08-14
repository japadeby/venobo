import 'reflect-metadata';
import { bootstrap } from './spyro';

import { MainWindow } from './windows';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

bootstrap([
  MainWindow,
], {
  quitAppOnAllWindowsClosed: true,
  serve,
}).catch(err => console.error(err));

