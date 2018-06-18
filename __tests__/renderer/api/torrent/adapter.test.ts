import { TorrentAdapter } from '../../../../src/renderer/api/torrent/adapter';

describe('TorrentAdapter', async () => {
    const torrentAdapter = new TorrentAdapter();

    beforeAll(() => torrentAdapter.checkProviders());

    // Yts proxy is slow
    it('should fetch movies by search query', async () => {
        const result = await torrentAdapter.search(null, 'movies', {
            search: 'Escape Plan'
        });

        expect(result).toHaveLength(12);
    }, 10000);
});