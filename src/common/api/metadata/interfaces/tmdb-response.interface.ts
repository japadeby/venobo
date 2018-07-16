export interface TMDbMetadata {
  poster_path: string;
  backdrop_path: string;
  media_type: string;
  overview: string;
  popularity: string;
  id: number;
  vote_average: number;
  vote_count: number;
  runtime: number;
  status: string;
  genres: {
    [key: number]: string;
    name: string;
  }[];
  origin_country?: string[];
  genre_ids?: number[];
}

export interface TMDbResponse {
  page: number;
  total_results: number;
  total_pages: number;
  results: (TMDbMetadata | TMDbMovieResponse | TMDbShowResponse)[];
}

export interface TMDbMovieResponse extends TMDbMetadata {
  title: string;
  original_title: string;
  release_date: string;
  imdb_id: string;
}

export interface TMDbShowResponse extends TMDbMetadata {
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  original_name: string;
}
