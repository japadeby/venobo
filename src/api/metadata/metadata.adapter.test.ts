import { MetadataAdapter } from './metadata.adapter';
import { ITorrent, TorrentAdapter } from '../torrent/index';
import { TestUtils } from '../../test-utils';
//import { Database } from '../../database';

describe('MetadataAdapter', () => {
  const torrentAdapter = new TorrentAdapter();
  const metadataAdapter = new MetadataAdapter(torrentAdapter);

  beforeAll(async () => {
    //await Database.truncate();
    await torrentAdapter.createProviders();
  });

  it('should fetch movie by id', async () => {
    const id = 427641;
    const data = await metadataAdapter.getMovieById(id);

    TestUtils.validateMovieMetadata(data);
    TestUtils.validateMovieTorrents(<ITorrent[]>data.torrents);
  });
});