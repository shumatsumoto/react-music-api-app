import { useEffect, useState } from "react";
import { SongList } from "./lib/components/SongList";
import spotify from "./lib/spotify";
import { useRef } from "react";
import { Player } from "./lib/components/Player";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const audioRef = useRef(null);

  useEffect(() => {
    fetchPopularSongs();
  }, []);

  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
    setIsLoading(false);
  };

  const handleSongSelected = async (song) => {
    setSelectedSong(song);
    audioRef.current.src = song.preview_url;
    playSong();
  };

  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  };

  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList
            isLoading={isLoading}
            songs={popularSongs}
            onSongSelected={handleSongSelected}
          />
        </section>
        {selectedSong && (
          <Player
            song={selectedSong}
            isPlay={isPlay}
            onButtonClick={toggleSong}
          />
        )}
        <audio ref={audioRef} />
      </main>
    </div>
  );
}
