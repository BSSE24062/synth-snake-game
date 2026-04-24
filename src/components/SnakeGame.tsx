import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play } from 'lucide-react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number, highScore: number) => void;
  key?: string | number;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    score: 0,
    highScore: 0,
    isGameOver: false,
    isPaused: true,
    speed: INITIAL_SPEED,
  });

  const lastMoveTime = useRef<number>(0);
  const requestRef = useRef<number>(null);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(p => p.x === newFood!.x && p.y === newFood!.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  useEffect(() => {
    onScoreChange(gameState.score, gameState.highScore);
  }, [gameState.score, gameState.highScore, onScoreChange]);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    setGameState(prev => ({
      ...prev,
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'UP',
      score: 0,
      isGameOver: false,
      isPaused: false,
      speed: INITIAL_SPEED,
    }));
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused) return prev;

      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Border collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      // Self collision
      if (prev.snake.some((p, index) => index !== 0 && p.x === newHead.x && p.y === newHead.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;
      let newSpeed = prev.speed;

      // Food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
        newSpeed = Math.max(MIN_SPEED, prev.speed - SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        highScore: Math.max(prev.highScore, newScore),
        speed: newSpeed,
      };
    });
  }, [generateFood, onScoreChange]);

  const gameLoop = useCallback((time: number) => {
    if (time - lastMoveTime.current > gameState.speed) {
      moveSnake();
      lastMoveTime.current = time;
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.speed, moveSnake]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameState(prev => {
        if (prev.isGameOver) return prev;
        
        switch (e.key) {
          case 'ArrowUp': if (prev.direction !== 'DOWN') return { ...prev, direction: 'UP', isPaused: false }; break;
          case 'ArrowDown': if (prev.direction !== 'UP') return { ...prev, direction: 'DOWN', isPaused: false }; break;
          case 'ArrowLeft': if (prev.direction !== 'RIGHT') return { ...prev, direction: 'LEFT', isPaused: false }; break;
          case 'ArrowRight': if (prev.direction !== 'LEFT') return { ...prev, direction: 'RIGHT', isPaused: false }; break;
          case 'w': if (prev.direction !== 'DOWN') return { ...prev, direction: 'UP', isPaused: false }; break;
          case 's': if (prev.direction !== 'UP') return { ...prev, direction: 'DOWN', isPaused: false }; break;
          case 'a': if (prev.direction !== 'RIGHT') return { ...prev, direction: 'LEFT', isPaused: false }; break;
          case 'd': if (prev.direction !== 'LEFT') return { ...prev, direction: 'RIGHT', isPaused: false }; break;
          case ' ': return { ...prev, isPaused: !prev.isPaused };
        }
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const size = Math.min(parent.clientWidth, parent.clientHeight);
        canvas.width = size;
        canvas.height = size;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const cellSize = canvas.width / GRID_SIZE;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Snake
      gameState.snake.forEach((p, index) => {
        ctx.fillStyle = index === 0 ? '#22d3ee' : `rgba(34, 211, 238, ${Math.max(0.2, 1 - index/10)})`;
        ctx.shadowBlur = index === 0 ? 15 : 0;
        ctx.shadowColor = '#22d3ee';
        
        ctx.fillRect(
          p.x * cellSize + 1,
          p.y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        );
      });

      // Food
      ctx.fillStyle = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ec4899';
      ctx.beginPath();
      ctx.arc(
        gameState.food.x * cellSize + cellSize / 2,
        gameState.food.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.shadowBlur = 0;
    };

    draw();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [gameState]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative border-2 border-cyan-500/30 rounded-lg overflow-hidden bg-[#050507]">
        <canvas
          ref={canvasRef}
          className="block"
        />

        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-20"
            >
              <h2 className="text-3xl font-black text-pink-500 uppercase tracking-tighter mb-4 italic">Game Over</h2>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </motion.div>
          )}

          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20 cursor-pointer"
              onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
            >
              <Play className="w-16 h-16 text-cyan-400 fill-cyan-400/20 animate-pulse" />
              <p className="mt-4 text-cyan-400/80 uppercase tracking-[0.3em] font-mono text-[10px]">Jump In</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direction HUD */}
        <div className="absolute bottom-4 right-4 flex gap-1 pointer-events-none opacity-50">
          <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-xs text-slate-500">W</div>
          <div className={`w-8 h-8 rounded border flex items-center justify-center text-xs transition-colors ${gameState.direction === 'LEFT' ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-white/10 text-slate-500'}`}>A</div>
          <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-xs text-slate-500">S</div>
          <div className={`w-8 h-8 rounded border flex items-center justify-center text-xs transition-colors ${gameState.direction === 'RIGHT' ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-white/10 text-slate-500'}`}>D</div>
        </div>
      </div>
    </div>
  );
}
