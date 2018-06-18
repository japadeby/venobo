import Gun from 'gun';
import { TMDbProvider } from './tmdb.provider';
import { ITorrent } from '../torrent/providers';

const db = Gun();

const media = db.get('media');
const lists = media.get('lists');
const discover = lists.get('discover');

const movies = media.get('movies');
const shows = media.get('shows');

export interface TorrentMovieMetadata {
    title: string;
    originalTitle: string;
    poster: string;
    backdrop: string;
    genres: string[];
    type: 'movie' | 'show';
    summary: string;
    popularity: string;
    tmdb: number;
    imdb: string;
    year: number;
    releaseDate: string;
    voted: number;
    votes: number;
    runtime: string;
    released: boolean;
    torrents: ITorrent[];
    _cacheExpiration: number;
}

export class MetadataAdapter {

    private tmdb = new TMDbProvider();

    private iso = 'da-DK';

    /*public discover(type: string, args: any) {


        discover.get('')
    }*/

    public getMovieById(tmdbId: number) {
        return new Promise((resolve, reject) => {
            movies.get(this.iso).get(tmdbId).once((movie: TorrentMovieMetadata) => {
                if (movie && movie._cacheExpiration) return resolve(movie);
            });
        });
    }

}