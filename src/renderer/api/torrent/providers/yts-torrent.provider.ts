import axios, { AxiosInstance } from 'axios';

import { ProviderUtils } from '../provider-utils';
import { Utils } from '../../../../utils';
import { ITorrent, ITorrentProvider } from './torrent-provider.interface';

export class YtsTorrentProvider implements ITorrentProvider {

    // Find a way to have dynamic endpoints
    endpoint = 'https://yts.unblocked.vet/api/v2/list_movies.json';
    provider = 'Yts';
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: this.endpoint,
            timeout: 2000,
        });
    }

    public fetch(imdbId) {
        return this.api.get('', {
            params: {
                query_term: imdbId,
                order_by: 'desc',
                sort_by: 'seeds',
                limit: 50,
            }
        });
    }

    public formatTorrent = (torrent: any): ITorrent => ({
        size: torrent.size,
        quality: torrent.quality,
        magnet: ProviderUtils.constructMagnet(torrent.hash),
        seeders: parseInt(torrent.seeds, 10),
        leechers: parseInt(torrent.peers, 10),
        metadata: (String(torrent.url) + String(torrent.hash)) || String(torrent.hash),
        verified: true,
        _provider: this.provider,
    })

    public getStatus() {
        return this.api.get('')
            .then(() => true)
            .catch(() => false);
    }

    public async provide(imdbId, type, { search }) {
        switch (type) {
            case 'movies':
                return this.fetch(imdbId || search)
                    .then(({ data: { data } }) => {
                        if (data.movie_count === 0) return [];

                        return Utils.merge(
                            data.movies.map(
                                ({ torrents }) => torrents.map(
                                    (torrent) => this.formatTorrent(torrent)
                                )
                            )
                        );
                    });

            default:
                return [];
        }
    }

}
