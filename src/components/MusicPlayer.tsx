import { useState, useRef, useEffect } from 'react';
import { SONGS } from '../constants';

export default function MusicPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = SONGS[currentIdx];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (direction: 1 | -1) => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    
    let nextIdx = (currentIdx + direction) % SONGS.length;
    if (nextIdx < 0) nextIdx = SONGS.length - 1;
    setCurrentIdx(nextIdx);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [currentIdx, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((audioRef.current.currentTime / duration) * 100);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full text-2xl pt-4">
      <audio ref={audioRef} src={currentSong.url} onTimeUpdate={handleTimeUpdate} onEnded={() => {skip(1); setIsPlaying(true);}} />
      
      <div className="flex flex-col gap-1 border-l-[6px] border-[#ff00ff] pl-6 py-2 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,255,0.1),transparent_50%)]">
        <div className="text-[#ff00ff] text-xl">TRACK_INDEX: 0{currentIdx + 1}//0{SONGS.length}</div>
        <div className="text-4xl glitch uppercase break-all w-full leading-none" data-text={currentSong.title}>{currentSong.title}</div>
        <div className="text-xl opacity-80 mt-2">SRC_ENTITY: {currentSong.artist}</div>
      </div>

      <div className="relative w-full h-8 border-[3px] border-[#00ffff] bg-black shadow-[4px_4px_0_#ff00ff]">
        <div className="absolute inset-0 bg-[#00ffff] opacity-20 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,255,255,0.5) 5px, rgba(0,255,255,0.5) 10px)" }}></div>
        <div 
          className="absolute top-0 left-0 h-full bg-[#ff00ff] transition-all duration-75 border-r-2 border-white"
          style={{ width: `${progress}%`, backgroundImage: "linear-gradient(to bottom, #ff00ff 0%, #a200a2 100%)" }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 border-t-[3px] border-[#00ffff] pt-6">
        <button onClick={() => { skip(-1); setIsPlaying(true); }} className="hover:text-black hover:bg-[#ff00ff] px-4 py-2 transition-colors border-2 border-transparent hover:border-[#ff00ff]">
          [ &lt;&lt; ]
        </button>
        <button onClick={togglePlay} className="hover:bg-[#00ffff] hover:text-black px-6 py-2 transition-colors font-black text-4xl border-2 border-transparent hover:border-[#00ffff] animate-pulse">
          {isPlaying ? '[ || ]' : '[ > ]'}
        </button>
        <button onClick={() => { skip(1); setIsPlaying(true); }} className="hover:text-black hover:bg-[#ff00ff] px-4 py-2 transition-colors border-2 border-transparent hover:border-[#ff00ff]">
          [ &gt;&gt; ]
        </button>
      </div>
    </div>
  );
}
