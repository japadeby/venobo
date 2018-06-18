import { TMDbProvider } from './tmdb.provider';
jest.mock('./tmdb.provider');

describe('TMDbProvider', () => {
  let tmdbProvider: TMDbProvider;

  beforeEach(() => {
    tmdbProvider = new TMDbProvider();
  });

  it('should find movies by search query', async () => {
    const result = await tmdbProvider.searchAll('Escape Plan');

    expect(result).toBeDefined();
    expect(result.page).toEqual(1);
  });
});
