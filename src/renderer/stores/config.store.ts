import { createMemoryHistory } from 'history';
import appConfigPath from 'application-config-path';
import isDevMode from 'electron-is-dev';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as os from 'os';

import { Database, UserDocument } from '../../common/database';
import pckg from '../../../package.json';

export interface ConfigState {
  userId: string; // Refers to id in <rootDir>/src/database/interfaces/user.document.ts
  version: string;
  user: UserDocument;
}

export class ConfigStore {

  public getTempPath() {
    return process.platform === 'win32'
      ? 'C:\\Windows\\Temp'
      : '/tmp';
  }

  public getConfigPath(): string {
    return isDevMode
      ? path.join(this.getTempPath(), pckg.productName)
      : appConfigPath(pckg.productName);
  }

  public getConfigFilePath(): string {
    return path.join(this.getConfigPath(), 'config.json');
  }

  public async trash() {
    return fse.rmdir(this.getConfigPath());
  }

  public async load(): Promise<ConfigState> {
    const configPath = this.getConfigFilePath();
    let config;
    let user;

    await fse.ensureDir(configPath);

    try {
      config = await fse.readJson(configPath);
    } catch (e) {
      config = this.getDefaultConfig();
      await fse.writeJson(configPath, config);
    }

    try {
      user = await Database.findOne<UserDocument>('users', {
        selector: { id: config.id },
      });
    } catch (e) {
      user = this.getDefaultUserConfig();

      await Database.users.put(user);
    }

    return {
      ...config,
      user,
    };
  }

  private getDefaultConfig = () => ({
    userId: os.hostname(),
    version: pckg.version,
  });

  // This should be saved in the database
  private getDefaultUserConfig = (): UserDocument => ({
    id: os.hostname(),
    prefs: {
      defaultQuality: '1080p',
      language: 'en',
      ietf: 'en-US',
    },
    history: createMemoryHistory(),
    starred: {
      movies: [],
      shows: [],
    },
    watched: {
      movies: [],
      shows: [],
    },
  });

}
