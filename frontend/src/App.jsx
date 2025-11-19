import { useState } from 'react';
import { api, BASE_URL } from './api.js';
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

            const sections = data.response.sections;
            const song = sections.find((s) => s.type === 'song');
            const lyrics = sections.find((s) => s.type === 'lyric');

            if (song.hits.length === 0 && lyrics.hits.length === 0) {
                setError('Song and lyrics not found');
                return;
            }

            const songData = {};
            song.hits.forEach((hit) => {
                const artist_name = hit.result.artist_names;
                const title = hit.result.title;
                const song_image = hit.result.song_art_image_thumbnail_url;
                const url = hit.result.url;

                songData[artist_name] = {
                    title,
                    song_image,
                    url,
                    youtubeUrl: null,
                };
            });
            setSongs(songData);

            const lyricsData = {};
            lyrics.hits.forEach((hit) => {
                const artist_name = hit.result.artist_names;
                const title = hit.result.title;
                const song_image = hit.result.song_art_image_thumbnail_url;
                const url = hit.result.url;

                if (!songData.hasOwnProperty(artist_name)) {
                    lyricsData[artist_name] = {
                        title,
                        song_image,
                        url,
                        youtubeUrl: null,
                    };
                }
            });
            setLyrics(lyricsData);

            const fetchYouTubeVideo = async (artist, title) => {
                const query = encodeURIComponent(`${artist} ${title}`);
                const res = await fetch(`${BASE_URL}/youtube?q=${query}`);
                const data = await res.json();
                return data.youtubeUrl;
            };

            Object.keys(songData).forEach(async (artist) => {
                const videoUrl = await fetchYouTubeVideo(
                    artist,
                    songData[artist].title
                );
                setSongs((prev) => ({
                    ...prev,
                    [artist]: { ...prev[artist], youtubeUrl: videoUrl },
                }));
            });

            Object.keys(lyricsData).forEach(async (artist) => {
                const videoUrl = await fetchYouTubeVideo(
                    artist,
                    lyricsData[artist].title
                );
                setLyrics((prev) => ({
                    ...prev,
                    [artist]: { ...prev[artist], youtubeUrl: videoUrl },
                }));
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-center text-white pt-10 mb-4">
                🎧 Type a lyric, find the track 🎧
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
                    className="w-1/3 max-lg:w-1/2 max-md:w-7/12 bg-[#1976d2]"
                    sx={{
                        input: { color: 'white' },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    loading={loading}
                >
                    Search
                </Button>
            </form>

            <h2 className="text-2xl font-bold text-center text-white mb-2">
                RESULT
            </h2>

            {loading ? (
                <div className="text-center mt-20">
                    <Ripples size="230" speed="2" color="#1976D2" />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center text-3xl">{error}</p>
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

                                {!songs[artist].youtubeUrl && (
                                    <img
                                        src={songs[artist].song_image}
                                        className="w-[200px]"
                                        alt={songs[artist].title}
                                    />
                                )}
                                {songs[artist].youtubeUrl && (
                                    <iframe
                                        width="200"
                                        height="150"
                                        src={`https://www.youtube.com/embed/${
                                            songs[artist].youtubeUrl.split(
                                                'v='
                                            )[1]
                                        }`}
                                        title={`${songs[artist].title} - ${artist}`}
                                        allowFullScreen
                                    ></iframe>
                                )}

                                <a
                                    href={songs[artist].url}
                                    target="_blank"
                                    className="text-lg text-white mt-3 px-3 py-1 bg-[#5585BF] rounded-xs"
                                >
                                    Lyrics link
                                </a>
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

                                {!lyrics[artist].youtubeUrl && (
                                    <img
                                        src={lyrics[artist].song_image}
                                        className="w-[200px]"
                                        alt={lyrics[artist].title}
                                    />
                                )}
                                {lyrics[artist].youtubeUrl && (
                                    <iframe
                                        width="200"
                                        height="150"
                                        src={`https://www.youtube.com/embed/${
                                            lyrics[artist].youtubeUrl.split(
                                                'v='
                                            )[1]
                                        }`}
                                        title={`${lyrics[artist].title} - ${artist}`}
                                        allowFullScreen
                                    ></iframe>
                                )}

                                <a
                                    href={lyrics[artist].url}
                                    target="_blank"
                                    className="text-lg text-white mt-3 px-3 py-1 bg-[#5585BF] rounded-xs"
                                >
                                    Lyrics link
                                </a>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default App;
