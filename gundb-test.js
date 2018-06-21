const Gun = require('gun');

const db = Gun();
const movies = db.get('movies');

const id = 440471;
const torrent = movies.get(id);
const language = "en-US";

// reset first
torrent.put(null);

const metadataList = torrent.get('metadata').get(language);
metadataList.put({
    "title": "Escape Plan 2: Hades",
    "originalTitle": "Escape Plan 2: Hades",
    "tmdb": id,
    "imdb": "tt6513656",
    "summary": "Ray Breslin manages an elite team of security specialists trained in the art of breaking people out of the world's most impenetrable prisons. When his most trusted operative, Shu Ren, is kidnapped and disappears inside the most elaborate prison ever built, Ray must track him down with the help of some of his former friends.",
    "popularity": 13.381902,
    "voted": 4.8,
    "votes": 14,
    "year": 2018,
    "releaseDate": "2018-06-05",
    "runtime": "93min",
    "released": true
});


const genresList = metadataList.get('genres');
["Crime", "Action", "Thriller"].forEach(genre => genresList.set(genre));

const torrents = [
    {
        "metadata": "Escape.Plan.2.Hades.2018.720p.BRRip.x264-MP4",
        "magnet": "magnet:?xt=urn:btih:c56a6e22762c1b1d5ee7f092ee5c606a1ce76c3b&dn=Escape.Plan.2.Hades.2018.720p.BRRip.x264-MP4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969",
        "seeders": 5339,
        "leechers": 2874,
        "verified": false,
        "provider": "ThePirateBay",
        "size": "",
        "method": "movies",
        "health": "healthy",
        "quality": "720p"
    },
    {
        "metadata": "Escape Plan 2 Hades.2018.DVDRip.XviD.AC3-EVO",
        "magnet": "magnet:?xt=urn:btih:c68577760d821c9b3101fb113207307042adac6f&dn=Escape+Plan+2+Hades.2018.DVDRip.XviD.AC3-EVO&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969",
        "seeders": 4528,
        "leechers": 4891,
        "verified": true,
        "provider": "ThePirateBay",
        "size": "",
        "method": "movies",
        "health": "poor",
        "quality": "720p"
    },
    {
        "metadata": "Escape.Plan.2.Hades.2018.1080p.BRRip.x264-MP4",
        "magnet": "magnet:?xt=urn:btih:1dd8a9c6686b25b4717a2a885f40b2e03b990af2&dn=Escape.Plan.2.Hades.2018.1080p.BRRip.x264-MP4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969",
        "seeders": 4510,
        "leechers": 2361,
        "verified": false,
        "provider": "ThePirateBay",
        "size": "",
        "method": "movies",
        "health": "healthy",
        "quality": "720p"
    }
];

const torrentsList = torrent.get('torrents');
torrents.forEach(torrent => torrentsList.set(torrent));

//movies.get(id).once(data => console.log('data', data));

movies.get(id).get('metadata').get(language).val(console.log);