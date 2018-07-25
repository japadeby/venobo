import { Injectable } from '@angular/core';
import { get, set } from 'lodash';
import * as fse from 'fs-extra';
import * as os from 'os';

import { AppConfig } from '../../environments';

export interface Settings {
  version: string;
  id: string;
  prefs: {
    language: string;
    ietf: string;
  };
  torrent: {
    default: {
      quality: string;
    };
    exclude: {
      cam: boolean;
      nonEng: boolean;
      hcSubs: boolean;
      withSubs: boolean;
    }
  };
  jackett?: {
    host: string;
    key: string;
  };
  starred: {
    movies: any[];
    shows: any[];
  };
  watched: {
    movies: any[];
    shows: any[];
  };
}

@Injectable()
export class ConfigService {

  private config: Settings;

  public async truncate() {
    return fse.rmdir(AppConfig.getPath());
  }

  public async load(): Promise<Settings> {
    const configPath = AppConfig.getSettingsPath();
    console.log('[Venobo] - Config Path: ', configPath);

    await fse.ensureFile(configPath);

    try {
      this.config = await fse.readJson(configPath);
    } catch (e) {
      this.config = this.getDefaultConfig();
      await fse.writeJson(configPath, this.config);
    }

    /*try {
      user = await Database.findOne<UserDocument>('users', {
        selector: { id: config.id },
      });
    } catch (e) {
      user = this.getDefaultUserConfig();

      await Database.users.post(user);
    }*/

    return this.config;
  }

  /*private getDefaultConfig = () => ({
    userId: os.hostname(),
    version: pckg.version,
  });*/

  public get(path?: string) {
    return !!path
      ? get(this.config, path)
      : this.config;
  }

  public async set(path: string, value: any) {
    const configPath = AppConfig.getSettingsPath();
    this.config = set(this.config, path, value);

    await fse.writeJson(configPath, this.config);
  }

  // This should be saved in the database
  private getDefaultConfig = (): Settings => ({
    // version: pckg.version,
    version: '0.0.1',
    id: os.hostname(),
    prefs: {
      language: 'en',
      ietf: 'en-US',
    },
    torrent: {
      default: {
        quality: '1080p',
      },
      exclude: {
        cam: true,
        nonEng: true,
        hcSubs: true,
        withSubs: true,
      },
    },
    starred: {
      movies: [],
      shows: [],
    },
    watched: {
      movies: [],
      shows: [],
    },
  })

}
