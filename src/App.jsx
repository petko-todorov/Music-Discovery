import { useState } from 'react';
import { api } from './api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Ripples } from 'ldrs/react';
import 'ldrs/react/Ripples.css';

function App() {
    const [text, setText] = useState('');
    const [songs, setSongs] = useState({});
    const [lyrics, setLyrics] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const findSongByLyrics = async (e) => {
        e.preventDefault();

        if (!text) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${api}${text}`);
            const data = await res.json();
            console.log(data);

            const sections = data.response.sections;
            const song = sections.find((s) => s.type === 'song');
            const lyrics = sections.find((s) => s.type === 'lyric');

            // if (song.hits.length === 0) {
            //     song = sections.find((s) => s.type === 'lyric');
            // }

            if (song.hits.length === 0 && lyrics.hits.length === 0) {
                setError('Song and lyrics not found');
                return;
            }

            const songData = {};
            song.hits.forEach((hit) => {
                console.log(hit.result);
                const artist_name = hit.result.artist_names;
                const title = hit.result.title;
                const song_image = hit.result.song_art_image_thumbnail_url;

                songData[artist_name] = {
                    title,
                    song_image,
                };
            });
            setSongs(songData);

            const lyricsData = {};
            lyrics.hits.forEach((hit) => {
                console.log(hit.result);
                const artist_name = hit.result.artist_names;
                const title = hit.result.title;
                const song_image = hit.result.song_art_image_thumbnail_url;

                if (!songData.hasOwnProperty(artist_name)) {
                    lyricsData[artist_name] = {
                        title,
                        song_image,
                    };
                }
            });
            setLyrics(lyricsData);

            console.log('123', songs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-center text-white pt-10 mb-4">
                🎧 Type a lyric, find the track
            </h1>

            <form
                onSubmit={findSongByLyrics}
                className="flex justify-center gap-3 mb-6"
            >
                <TextField
                    hiddenLabel
                    size="medium"
                    placeholder="Type a lyric"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-1/4 bg-[#1976d2]"
                    sx={{
                        input: { color: 'white' },
                    }}
                />

                <Button type="submit" variant="contained" size="medium">
                    Search
                </Button>
            </form>

            <h2 className="text-2xl font-bold text-center text-white mb-2">
                RESULTS
            </h2>

            {loading ? (
                <div className="text-center mt-20">
                    <Ripples size="230" speed="2" color="#1976D2" />
                </div>
            ) : (
                <>
                    {Object.keys(songs).length > 0 && (
                        <h3 className="text-2xl font-bold text-center text-white mb-3">
                            Songs
                        </h3>
                    )}
                    <div className="flex justify-center gap-5 flex-wrap">
                        {Object.keys(songs).map((artist) => (
                            <div
                                key={artist}
                                className="flex flex-col items-center justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 border-2 border-white rounded-lg pb-3 pt-1 px-2"
                            >
                                <h1 className="text-lg font-bold text-white text-center">
                                    {artist}
                                </h1>

                                <h2 className="text-lg font-bold text-white text-center mb-3">
                                    {songs[artist].title}
                                </h2>

                                <img
                                    src={songs[artist].song_image}
                                    className="w-[200px]"
                                    alt={songs[artist].title}
                                />
                            </div>
                        ))}
                    </div>

                    {Object.keys(lyrics).length > 0 && (
                        <h3 className="text-2xl font-bold text-center text-white my-3">
                            Lyrics
                        </h3>
                    )}
                    <div className="flex justify-center gap-5 flex-wrap">
                        {Object.keys(lyrics).map((artist) => (
                            <div
                                key={artist}
                                className="flex flex-col items-center justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 border-2 border-white rounded-lg pb-3 pt-1 px-2"
                            >
                                <h1 className="text-lg font-bold text-white text-center">
                                    {artist}
                                </h1>

                                <h2 className="text-lg font-bold text-white text-center mb-3">
                                    {lyrics[artist].title}
                                </h2>

                                <img
                                    src={lyrics[artist].song_image}
                                    className="w-[200px]"
                                    alt={lyrics[artist].title}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default App;
