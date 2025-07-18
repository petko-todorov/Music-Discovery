import { useState } from 'react';
import { api } from './api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function App() {
    const [text, setText] = useState('');

    const findSongByLyrics = async (e) => {
        e.preventDefault();

        if (!text) return;

        try {
            const res = await fetch(`${api}${text}`);
            const data = await res.json();
            console.log(data);

            const sections = data.response.sections;
            const topHitSection = sections.find((s) => s.type === 'top_hit');

            topHitSection?.hits.forEach((hit) => {
                console.log(hit);
            });
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <h1 className="text-xl font-bold text-center text-white">
                🎧 Type a lyric, find the track
            </h1>

            <form
                onSubmit={findSongByLyrics}
                className="flex justify-center gap-3"
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
        </>
    );
}

export default App;
