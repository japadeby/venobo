import { TorrentAdapter } from './torrent.adapter';
import { TestUtils } from '../../../test-utils';
import { MOVIES } from '../../../constants';

describe('TorrentAdapter', () => {
  const torrentAdapter = new TorrentAdapter();

  beforeAll(() => torrentAdapter.checkProviders());

  it('should check providers', () => {
    return expect(torrentAdapter.checkProviders()).resolves.toBeUndefined();
  });

  it('should fetch torrents by search query', async () => {
    const torrents = await torrentAdapter.search(null, MOVIES, {
      search: 'Escape Plan',
    });

    return TestUtils.validateMovieTorrents(torrents);
  });

  it('should fetch torrents by imdb id', async () => {
    const torrents = await torrentAdapter.search('tt1211956', MOVIES);

    return TestUtils.validateMovieTorrents(torrents);
  });
});
