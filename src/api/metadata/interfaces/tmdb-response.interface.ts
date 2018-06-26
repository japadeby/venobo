export interface TMDbResponse {
  poster_path: string;
  backdrop_path: string;
  genres: {
    [key: number]: string;
    name: string;
  }[];
  overview: string;
  popularity: string;
  id: number;
  vote_average: number;
  vote_count: number;
  runtime: number;
  status: string;
}

export interface TMDbMovieResponse extends TMDbResponse {
  title: string;
  original_title: string;
  release_date: string;
  imdb_id: string;
}

export interface TMDbShowResponse extends TMDbResponse {
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  original_name: string;
}
