import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function MusicPlayer({ currentTrackIndex, setCurrentTrackIndex, isPlaying, setIsPlaying }: MusicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];
  
  // Simulated progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev + 0.5) % 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <>
      {/* Left section: Track info */}
      <div className="flex items-center gap-4 w-1/4 min-w-0">
        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          <img src={currentTrack.cover} alt="" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
        </div>
        <div className="min-w-0 overflow-hidden text-left">
          <p className="text-sm font-bold text-white truncate leading-tight mb-0.5">{currentTrack.title}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-tight truncate font-bold">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center section: Playback controls + Progress */}
      <div className="flex flex-col items-center gap-2 w-1/2">
        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
             <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
          <button onClick={handleNext} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
             <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500 tabular-nums">0:42</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 tabular-nums">3:12</span>
        </div>
      </div>

      {/* Right section: System controls */}
      <div className="flex items-center justify-end gap-4 w-1/4">
        <Volume2 className="h-5 w-5 text-slate-500" />
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-white rounded-full"></div>
        </div>
      </div>
    </>
  );
}
