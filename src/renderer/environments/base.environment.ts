import * as path from 'path';

const appConfigPath = require('application-config-path');
const isDevMode = require('electron-is-dev');

export abstract class BaseEnvironment {
  public static tmdb = {
    api: 'https://api.themoviedb.org/3',
    key: '56dc6f8e86f739bbce37281a8ad47641',
    poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2',
    backdrop: 'https://image.tmdb.org/t/p/original',
    still: 'https://image.tmdb.org/t/p/w227_and_h127_bestv2',
    appendToResponse: 'external_ids,videos',
  };

  public static cachePath = BaseEnvironment.getPath('cache');

  public static getPath(...paths: string[]): string {
    return path.join(isDevMode
      ? path.join(BaseEnvironment.getTempPath(), 'Venobo Dev')
      : appConfigPath('Venobo'), ...paths);
  }

  public static getTempPath() {
    return process.platform === 'win32'
      ? 'C:\\Windows\\Temp'
      : '/tmp';
  }

  public static getSettingsPath(): string {
    return path.join(BaseEnvironment.getPath(), 'config.json');
  }
}
