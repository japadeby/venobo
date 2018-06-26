import { TMDbProvider } from './tmdb.provider';
//import { Database } from '../../database';
jest.mock('./tmdb.provider');

describe('TMDbProvider', () => {
  const tmdbProvider = new TMDbProvider();

  //beforeAll(() => Database.truncate());

  it('should find movies by search query', async () => {
    const result = await tmdbProvider.searchAll('Escape Plan');

    expect(result).toBeDefined();
    expect(result.page).toEqual(1);
  });
});
