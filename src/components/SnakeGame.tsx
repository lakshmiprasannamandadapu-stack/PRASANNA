import { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, INITIAL_SPEED } from '../constants';

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  
  const currentDir = useRef(dir);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 0, y: -1 });
    currentDir.current = { x: 0, y: -1 };
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setTimeout(() => containerRef.current?.focus(), 10);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === " " && !gameOver) {
        setIsPaused(p => !p);
        return;
      }
      if (isPaused || gameOver) return;

      const { x, y } = currentDir.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) { setDir({ x: 0, y: -1 }); currentDir.current = { x: 0, y: -1 }; }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) { setDir({ x: 0, y: 1 }); currentDir.current = { x: 0, y: 1 }; }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) { setDir({ x: -1, y: 0 }); currentDir.current = { x: -1, y: 0 }; }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) { setDir({ x: 1, y: 0 }); currentDir.current = { x: 1, y: 0 }; }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 8));
    return () => clearInterval(intervalId);
  }, [dir, food, gameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full min-w-[320px] pt-4">
      <div className="flex justify-between w-full mb-4 bg-[#ff00ff] text-black px-4 py-2 text-3xl font-black shadow-[4px_4px_0_#00ffff]">
        <div>SCORE_REG</div>
        <div className="font-mono">{score.toString().padStart(4, '0')}</div>
      </div>

      <div 
        ref={containerRef}
        tabIndex={0}
        className="relative bg-[#001111] border-[6px] border-[#00ffff] w-full max-w-[420px] aspect-square overflow-hidden shadow-[inset_0_0_40px_rgba(0,255,255,0.3)] outline-none focus:border-[#ff00ff] transition-colors"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`, backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`, opacity: 0.15 }} />

        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              backgroundColor: i === 0 ? '#ffffff' : '#00ffff',
              boxShadow: i === 0 ? '0 0 10px #ffffff' : 'none',
              border: '2px solid #000'
            }}
          />
        ))}

        <div
          className="absolute animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            backgroundColor: '#ff00ff',
            border: '2px solid #000',
            boxShadow: '0 0 15px #ff00ff',
          }}
        />

        {(isPaused || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            {gameOver ? (
              <>
                <div className="text-[#ff00ff] text-6xl font-black mb-8 glitch" data-text="FATAL_ERR">FATAL_ERR</div>
                <button onClick={resetGame} className="border-[4px] border-[#ff00ff] text-[#ff00ff] px-6 py-3 hover:bg-[#ff00ff] hover:text-black text-3xl font-bold bg-black shadow-[6px_6px_0_#00ffff]">
                  [ REBOOT_SEQ ]
                </button>
              </>
            ) : (
              <button onClick={() => { setIsPaused(false); containerRef.current?.focus(); }} className="border-[4px] border-[#00ffff] text-[#00ffff] px-8 py-4 hover:bg-[#00ffff] hover:text-black text-4xl font-bold bg-black shadow-[6px_6px_0_#ff00ff] animate-bounce cursor-pointer">
                [ EXECUTE ]
              </button>
            )}
            <div className="mt-10 mb-4 p-4 border-2 border-dashed border-[#ff00ff] text-center text-[#00ffff] text-2xl bg-black">
              INPUT: ARROWS / WASD<br/>
              SUSPEND: SPACEBAR
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
