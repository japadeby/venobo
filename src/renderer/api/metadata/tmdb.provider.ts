import axios, {AxiosInstance} from 'axios';

//import { IMetadataProvider } from './metadata-provider.interface';

const TMDB = {
    API: 'https://api.themoviedb.org',
    KEY: '56dc6f8e86f739bbce37281a8ad47641',
    POSTER: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2',
    BACKDROP: 'https://image.tmdb.org/t/p/original',
    STILL: 'https://image.tmdb.org/t/p/w227_and_h127_bestv2',
    GENRES: {
        MOVIES: {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            14: 'Fantasy',
            36: 'History',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
        },
        SHOWS: {
            10759: 'Action & Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            10762: 'Kids',
            9648: 'Mystery',
            10763: 'News',
            10764: 'Reality',
            10765: 'Sci-Fi & Fantasy',
            10766: 'Soap',
            10767: 'Talk',
            10768: 'War & Politics',
            37: 'Western'
        }
    },
    SORT_BY: [
        'popularity.desc',
        'release_date.desc',
        'vote_count.desc',
        'original_title.desc'
        ]
};

export class TMDbProvider/* implements IMetadataProvider*/ {

    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: `${TMDB.API}/3`,
            params: {
                api_key: TMDB.KEY,
                language: 'da-DK',
                append_to_response: 'external_ids,videos',
            }
        });
    }

    private convertType(type: string) {
        return type === 'shows' ? 'tv' : 'movie';
    }

    public formatEpisodePoster(path: string) {
        return TMDB.STILL + path;
    }

    public formatBackdrop(path: string) {
        return TMDB.BACKDROP + path;
    }

    public formatPoster(path: string) {
        return TMDB.POSTER + path;
    }

    public getSimilar(type: string, tmdbId: number) {
        return this.api.get(`${this.convertType(type)}/${tmdbId}/similar`);
    }

    public getRecommendations(type: string, tmdbId: number) {
        return this.api.get(`${this.convertType(type)}/${tmdbId}/recommendations`);
    }

    public getPopular(type: string, page: number = 1) {
        return this.api.get(`${this.convertType(type)}/popular`, {
            params: { page },
        });
    }

    public getTopRated(type: string, page: number = 1) {
        return this.api.get(`${this.convertType(type)}/top_rated`, {
            params: { page },
        });
    }

    public get(type: string, tmdbId: number) {
        return this.api.get(`${this.convertType(type)}/${tmdbId}`);
    }

    public getShowSeason(tmdbId: number, season: number) {
        return this.api.get(`tv/${tmdbId}/season/${season}`);
    }

    public getShowSeasonEpisode(tmdbId: number, season: number, episode: number) {
        return this.api.get(`tv/${tmdbId}/season/${season}/episode/${episode}`);
    }

    public searchAll(query: string, page: number = 1) {
        return this.api.get('search/multi', {
            params: {
                include_adult: 'da-DK',
                page,
                query,
            }//this.state.saved.prefs.includeAdult
        });
    }

    public discover(type: string, params?: any) {
        return this.api.get(`discover/${this.convertType(type)}`, { params });
    }

}