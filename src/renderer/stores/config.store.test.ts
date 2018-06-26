import * as fse from 'fs-extra';
import { ConfigStore } from './config.store';

describe('ConfigStore', () => {
  const configStore = new ConfigStore();
  const configPath = configStore.getConfigPath();

  it('should load config', async () => {
    const config = configStore.load();

    await expect(config).resolves.toBeCalled();
    await expect(fse.pathExists(configPath)).resolves.toBeCalled();
  });

  it('should truncate config', async () => {
    await configStore.trash();

    await expect(fse.pathExists(configPath)).rejects.toBeCalled();
  });
});
