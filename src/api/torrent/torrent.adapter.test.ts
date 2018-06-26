import { TorrentAdapter } from './torrent.adapter';
import { TestUtils } from '../../test-utils';
import { MOVIES } from '../../constants';

describe('TorrentAdapter', () => {
  const torrentAdapter = new TorrentAdapter();

  beforeAll(() => torrentAdapter.createProviders());

  it('should check providers', () => {
    return expect(torrentAdapter.createProviders()).resolves.toBeUndefined();
  });

  it('should fetch torrents by search query', async () => {
    const torrents = await torrentAdapter.search('Escape Plan', MOVIES);

    return TestUtils.validateMovieTorrents(torrents);
  });

  it('should fetch torrents by imdb id', async () => {
    const torrents = await torrentAdapter.search('Rampage (2018)', MOVIES, {
      imdbId: 'tt2231461'
    });

    return TestUtils.validateMovieTorrents(torrents);
  });
});
