import TraktMetaDataProvider from './metadata/trakt'

const Trakt = new TraktMetaDataProvider()

Trakt.getPopularMovies().then(console.log)
