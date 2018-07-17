export const AppConfig = {
  production: false,
  environment: 'LOCAL',
  tmdb: {
    api: 'https://api.themoviedb.org/3',
    key: '56dc6f8e86f739bbce37281a8ad47641',
    poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2',
    backdrop: 'https://image.tmdb.org/t/p/original',
    still: 'https://image.tmdb.org/t/p/w227_and_h127_bestv2',
    appendToResponse: 'external_ids,videos',
  }
};
