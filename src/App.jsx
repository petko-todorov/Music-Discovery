import { useState } from 'react';
import { api } from './api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function App() {
    const [text, setText] = useState('');
    const [songs, setSongs] = useState({});
    const [error, setError] = useState('');

    const findSongByLyrics = async (e) => {
        e.preventDefault();

        if (!text) return;

        try {
            const res = await fetch(`${api}${text}`);
            const data = await res.json();
            console.log(data);

            const sections = data.response.sections;
            let song = sections.find((s) => s.type === 'song');

            if (song.hits.length === 0) {
                song = sections.find((s) => s.type === 'lyric');
            }

            if (song.hits.length === 0) {
                setError('Song and lyrics not found');
                return;
            }

            const newData = {};
            song.hits.forEach((hit) => {
                console.log(hit.result);
                const artist_name = hit.result.artist_names;
                const title = hit.result.title;
                const song_image = hit.result.song_art_image_thumbnail_url;

                newData[artist_name] = {
                    title,
                    song_image,
                };
            });

            setSongs(newData);
        } catch (error) {
            console.error(error);
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

            <h2 className="text-2xl font-bold text-center text-white mb-5">
                RESULTS
            </h2>

            <div className="flex justify-center gap-5 flex-wrap">
                {Object.keys(songs).map((artist) => (
                    <div
                        key={artist}
                        className="flex flex-col items-center justify-end w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"
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
        </>
    );
}

export default App;
