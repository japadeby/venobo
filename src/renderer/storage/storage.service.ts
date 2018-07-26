import { Inject, Injectable } from '@angular/core';

import { AES, enc } from 'crypto-js';
import * as md5 from 'crypto-js/md5';
import * as fse from 'fs-extra';
import * as path from 'path';

import { StorageModuleOptions } from './storage.module';
import { USE_STORAGE_OPTIONS } from './tokens';

@Injectable()
export class StorageService {

  private readonly options: StorageModuleOptions;

  constructor(
    @Inject(USE_STORAGE_OPTIONS)
    options: StorageModuleOptions
  ) {
    // Set default options
    this.options = {
      encoding: 'utf8',
      encrypt: {
        type: 'MD5',
      },
      ...options,
    };
  }

  public async create() {
    await fse.ensureDir(this.options.path);
  }

  public getPath(key: string) {
    const cacheKey = this.options.encrypt.fileName
      ? md5(key).toString()
      : key;

    return path.join(this.options.path, cacheKey);
  }

  private encryptByType(data: string) {
    switch (this.options.encrypt.type) {
      case 'AES':
        return AES.encrypt(data, this.options.secret).toString();
    }
  }

  private encrypt<T = string>(data: T) {
    data = this.stringify(data);

    return this.options.encrypt.fileContent
      ? this.encryptByType(data)
      : data;
  }

  private decrypt<T>(data: string): T {
    if (this.options.encrypt.fileContent) {
      data = AES.decrypt(
        data.toString(),
        this.options.secret,
      ).toString(enc.Utf8);
    }

    return this.parse(data);
  }

  public async write<T = string>(key: string, data: T): T {
    const writePath = this.getPath(key);

    await fse.writeFile(
      writePath,
      this.encrypt(data),
      this.options.encoding
    );

    return data;
  }

  public async read<T>(key: string): T {
    const data = await fse.readFile(
      this.getPath(key),
      this.options.encoding,
    );

    return this.decrypt<T>(data);
  }

  public exists(key: string) {
    return fse.stat(this.getPath(key));
  }

  public async existsThenRead(key: string) {
    await this.exists(key);

    return await this.read(key);
  }

  public async isNotExpired(key: string, maxAgeInMinutes: number = 180) { // 3 hours
    const stat = await this.exists(key);

    if (Date.now() - new Date(stat.mtime).getTime() >= (maxAgeInMinutes * 60000)) {
      throw new Error('File is too old!');
    }
  }

  public async isNotExpiredThenRead(key: string, maxAgeMinutes?: number) {
    await this.isNotExpired(key, maxAgeMinutes);

    return await this.read(key);
  }

  private stringify(data: any) {
    return typeof data === 'object' ? JSON.stringify(data) : data;
  }

  private parse(data: any) {
    return this.isJSON(data) ? JSON.parse(data) : data;
  }

  /**
   * @author <https://github.com/chriso/validator.js/blob/master/src/lib/isJSON.js>
   */
  private isJSON(data: any) {
    try {
      const obj = JSON.parse(data);
      return !!obj && typeof obj === 'object';
    } catch (e) { /* ignore */ }
    return false;
  }

}
