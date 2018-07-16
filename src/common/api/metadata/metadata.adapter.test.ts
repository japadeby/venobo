import { MetadataAdapter } from './metadata.adapter';
import { ITorrent, TorrentAdapter } from '../torrent';
import { TestUtils } from '../../test-utils';
import { ConfigStore } from '../../../renderer/stores/config.store';
import { MovieMetadata } from './interfaces';

describe('MetadataAdapter', () => {
  const torrentAdapter = new TorrentAdapter();
  let metadataAdapter: MetadataAdapter;

  beforeAll(async () => {
    const config = await (new ConfigStore()).load();
    metadataAdapter = new MetadataAdapter(torrentAdapter, config);

    await torrentAdapter.createProviders();
  });

  describe('getMovieById', () => {
    it('should fetch movie by id', async () => {
      const id = 427641;
      const data = await metadataAdapter.getMovieById(id);

      TestUtils.validateMovieMetadata(data);
      TestUtils.validateMovieTorrents(<ITorrent[]>data.torrents);
    });
  });

  describe('getTopRated', () => {
    it('should fetch top rated movies', async () => {
      const data = await metadataAdapter.getTopRated('movies') as any;

      TestUtils.validateMovieMetadata(data);
      TestUtils.validateMovieTorrents(data.torrents);
    });
  });
});