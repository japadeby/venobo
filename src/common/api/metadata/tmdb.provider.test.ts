import { TMDbProvider } from './tmdb.provider';
import { ConfigStore } from '../../../renderer/stores/config.store';
jest.mock('./tmdb.provider');

describe('TMDbProvider', () => {
  let tmdbProvider: TMDbProvider;

  beforeAll(async () => {
    const config = await (new ConfigStore()).load();
    tmdbProvider = new TMDbProvider(config);
  });

  describe('searchAll', () => {
    it('should find movies by search query', async () => {
      const result = await tmdbProvider.searchAll('Escape Plan');

      expect(result).toBeDefined();
      expect(result.page).toEqual(1);
    });
  });
});
