import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Disc } from 'lucide-react';
import { TRACKS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const resetGame = () => {
    setGameKey(prev => prev + 1);
    setScore(0);
  };

  const handleScoreChange = (newScore: number, newHighScore: number) => {
    setScore(newScore);
    setHighScore(newHighScore);
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="bg-[#0a0a0c] text-slate-100 h-screen w-full flex flex-col font-sans overflow-hidden">
      {/* Header Section */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#0d0d12] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Music className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Synth<span className="text-cyan-400 font-bold">Snake</span>
          </h1>
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">High Score</p>
            <p className="text-xl font-mono text-cyan-400">{highScore.toString().padStart(5, '0')}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Current Score</p>
            <p className="text-xl font-mono text-white">{score.toString().padStart(5, '0')}</p>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex p-6 gap-6 min-h-0 overflow-hidden">
        {/* Left Sidebar: Music Library */}
        <aside className="w-72 bg-[#0d0d12] border border-white/5 rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden shrink-0">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-4">Audio Stream</h2>
          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {TRACKS.map((track, i) => (
              <button 
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(i);
                  setIsPlaying(true);
                }}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all border ${
                  i === currentTrackIndex 
                    ? 'bg-white/5 border-white/10' 
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-md shrink-0 bg-gradient-to-br ${
                  i === 0 ? 'from-cyan-500 to-blue-600' : 
                  i === 1 ? 'from-pink-500 to-purple-600' : 'from-emerald-500 to-teal-600'
                }`} />
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-sm font-semibold truncate ${i === currentTrackIndex ? 'text-white' : 'text-slate-300'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate tracking-tight">{track.artist}</p>
                </div>
                {i === currentTrackIndex && isPlaying && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl shrink-0">
            <p className="text-[10px] text-cyan-400 font-bold uppercase mb-1">Status</p>
            <p className="text-xs text-cyan-200 leading-relaxed font-medium">Collecting bits increases synth-wave intensity.</p>
          </div>
        </aside>

        {/* Center: Snake Game Window */}
        <section className="flex-1 relative bg-[#050507] rounded-3xl border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Grid Pattern Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="z-10 w-full h-full max-w-[480px] max-h-[480px]">
            <SnakeGame key={gameKey} onScoreChange={handleScoreChange} />
          </div>
        </section>

        {/* Right Sidebar: Stats */}
        <aside className="w-64 bg-[#0d0d12] border border-white/5 rounded-2xl p-4 flex flex-col gap-6 shrink-0">
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-4">Visualizer</h2>
            <div className="flex items-end gap-1 h-20 px-2">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-cyan-500/40 rounded-t-sm" 
                  style={{ 
                    height: isPlaying ? `${Math.floor(Math.random() * 80) + 20}%` : '10%',
                    transition: 'height 0.2s ease-in-out'
                  }} 
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Environment</h2>
            <div className="px-2 space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Grid Size</span>
                <span className="text-white">20 x 20</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Rendering</span>
                <span className="text-cyan-400 font-bold uppercase tracking-tighter">GPU-Sync</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Audio Bitrate</span>
                <span className="text-white">320kbps</span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-6">
             <div className="flex flex-col items-center justify-center py-6 gap-2 border border-white/5 rounded-xl bg-white/2 overflow-hidden relative">
                <Disc className={`w-20 h-20 text-white/5 absolute -right-4 -bottom-4 ${isPlaying ? 'animate-spin' : ''}`} />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] relative z-10">System Status</p>
                <div className="h-1.5 w-24 bg-white/10 rounded-full relative z-10">
                   <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
                </div>
                <p className="text-xs text-white/80 font-mono relative z-10">READY_0248</p>
             </div>
             <button 
               onClick={resetGame}
               className="w-full py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors cursor-pointer"
             >
               Reset Game
             </button>
          </div>
        </aside>
      </main>

      {/* Bottom Bar: Player Controls */}
      <footer className="h-24 bg-[#0d0d12] border-t border-white/5 px-8 flex items-center justify-between shrink-0">
        <MusicPlayer 
          currentTrackIndex={currentTrackIndex}
          setCurrentTrackIndex={setCurrentTrackIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </footer>
    </div>
  );
}

