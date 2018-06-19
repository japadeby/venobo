import { ProviderUtils } from './provider-utils';
import { Utils } from '../../../utils';
import {
    //iDopeTorrentProvider,
    KickassTorrentProvider,
    ThePirateBayTorrentProvider,
    YtsTorrentProvider
} from './providers';
import {
    ExtendedDetails,
    ITorrent,
    ITorrentProvider
} from './interfaces';

export class TorrentAdapter {

    private availableProviders: ITorrentProvider[];

    private allProviders: ITorrentProvider[] = [
        //new iDopeTorrentProvider(),
        new YtsTorrentProvider(),
        new ThePirateBayTorrentProvider(),
        new KickassTorrentProvider(),
    ];

    public async checkProviders() {
        const providerStatuses = this.allProviders.map(
            provider => provider.getStatus()
        );
        const resolvedProviderStatuses = await Promise.all(providerStatuses);

        this.availableProviders = this.allProviders
            .map((x, i) => [x, resolvedProviderStatuses[i]])
            .filter(provider => !!provider[1])
            .map(a => a.shift() as ITorrentProvider);
    }

    private async selectTorrents(torrents: ITorrent[]) {
        return ProviderUtils.sortTorrentsBySeeders(
          torrents.filter(
              torrent => !!torrent.quality// && torrent.quality !== 'n/a'
          )
        );
    }

    private appendAttributes(providerResults: ITorrent[][], method: string) {
        return Utils.merge(providerResults).map(result => ({
            ...result,
            method,
            cached: Date.now(),
            health: ProviderUtils.getHealth(result.seeders || 0, result.leechers || 0),
            quality: !!result.quality
                ? result.quality
                : ProviderUtils.determineQuality(result.metadata, result.magnet),
        }));
    }

    private filterShows(show, { season, episode }: ExtendedDetails) {
        return (
            show.metadata.toLowerCase().includes(
                ProviderUtils.formatSeasonEpisodeToString(
                    <string>season,
                    <string>episode,
                )
            ) && show.seeders !== 0
        );
    }

    public async search(imdbId: string | null, type: string, extendedDetails: ExtendedDetails = {}) {
        const torrentPromises = this.availableProviders.map(
            provider => provider.provide(imdbId, type, extendedDetails)
        );

        const providerResults = await Promise.all(torrentPromises);

        switch (type) {
            case 'movies':
                return this.selectTorrents(
                    this.appendAttributes(providerResults, 'movies')
                );

            case 'shows':
                return this.selectTorrents(
                    this.appendAttributes(providerResults, 'shows')
                        .filter(show => !!show.metadata)
                        .filter(show => this.filterShows(show, extendedDetails))
                );

            default:
                return [];
        }
    }

}
