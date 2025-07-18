import { useState } from 'react';
import { api } from './api';

function App() {
    const [text, setText] = useState('');

    const findSongByLyrics = async (e) => {
        e.preventDefault();
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
            <form onSubmit={findSongByLyrics}>
                <h1>🎧 Type a lyric, find the track</h1>
                <input
                    type="text"
                    placeholder="Type a lyric"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Search
                </button>
            </form>
        </>
    );
}

export default App;
