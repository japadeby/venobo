import { TorrentAdapter } from './torrent.adapter';
import { ITorrent } from './providers';

describe('TorrentAdapter', () => {
  const torrentAdapter = new TorrentAdapter();

  function validateMovieTorrents(torrents: Promise<ITorrent[]>) {
    return expect(torrents).resolves.toContainEqual(
      expect.objectContaining({
        size: expect.any(String),
        magnet: expect.any(String),
        _provider: expect.any(String),
        seeders: expect.any(Number),
        quality: expect.any(String),
        method: expect.any(String),
        health: expect.any(String),
        metadata: expect.any(String),
      })
    );
  }

  it('should check providers', () => {
    return expect(torrentAdapter.checkProviders()).resolves.toBeTruthy();
  });

  // Yts proxy is slow
  it('should fetch movies by search query', () => {
    const result = torrentAdapter.search(null, 'movies', {
      search: 'Escape Plan',
    });

    return validateMovieTorrents(result);
  }, 10000);
});
