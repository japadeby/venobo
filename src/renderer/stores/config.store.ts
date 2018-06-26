import { createMemoryHistory } from 'history';
import appConfigPath from 'application-config-path';
import isDevMode from 'electron-is-dev';
import * as pckg from '../../../package.json';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as os from 'os';

import { Database } from '../../database'
import { UserDocument } from '../../database/interfaces';

export interface ConfigState {
  userId: string; // Refers to id in <rootDir>/src/database/interfaces/user.document.ts
  version: string;
  user: UserDocument;
}

export class ConfigStore {

  public getTempPath() {
    return process.platform === 'win32'
      ? 'C:\\Windows\\Temp'
      : '/tmp'
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
    let users;

    await fse.ensureFile(configPath);

    try {
      config = await fse.readJson(configPath);
    } catch (e) {
      config = this.getDefaultConfig();
      await fse.writeJson(configPath, config);
    }

    try {
      users = await Database.findOne<UserDocument>('users', {
        selector: { id: config.id },
      });
    } catch (e) {
      users = this.getDefaultUserConfig();

      await Database.users.put(users);
    }

    return {
      ...config,
      users: users[0],
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
