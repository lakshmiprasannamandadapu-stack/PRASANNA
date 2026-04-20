import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center justify-center p-4 crt flicker tear-bg relative shadow-[inset_0_0_100px_rgba(255,0,255,0.2)]">
      <div className="fixed inset-0 pointer-events-none border-[10px] border-[#ff00ff] mix-blend-difference opacity-50 z-50"></div>
      
      <header className="absolute top-4 left-4 z-10 w-full flex flex-col md:flex-row justify-between pr-8">
        <h1 className="text-5xl lg:text-7xl font-black tracking-widest text-[#00ffff] glitch uppercase drop-shadow-[4px_4px_0_#ff00ff]" data-text="SYS_GLITCH_OS">
          SYS_GLITCH_OS
        </h1>
        <div className="text-left md:text-right text-[#ff00ff] text-2xl lg:text-3xl pt-2 uppercase break-all max-w-[300px] leading-none mt-2 md:mt-0">
          ERR_CODE: 0xDEADBEEF<br/>
          <span className="text-[#00ffff] text-xl">AUDIO_SNAKE_CORRUPT</span>
        </div>
      </header>

      <main className="flex flex-col xl:flex-row items-center justify-center gap-16 w-full max-w-6xl z-10 mt-32 xl:mt-0">
        
        <div className="w-full max-w-md border-[6px] border-[#00ffff] bg-black p-2 shadow-[12px_12px_0_#ff00ff]">
           <div className="border-2 border-[#00ffff] p-6 border-dashed relative">
             <div className="absolute -top-4 -left-2 text-2xl mb-4 bg-[#ff00ff] text-black px-2 animate-pulse uppercase">
               [ MODULE::AUDIO_DECODER ]
             </div>
             <MusicPlayer />
           </div>
        </div>

        <div className="w-full max-w-lg border-[6px] border-[#ff00ff] bg-black p-2 shadow-[-12px_12px_0_#00ffff]">
           <div className="border-2 border-[#ff00ff] p-6 border-dashed relative">
              <div className="absolute -top-4 -right-2 text-2xl mb-4 bg-[#00ffff] text-black px-2 uppercase shadow-[-4px_4px_0_#ff00ff]">
               [ MODULE::ENTITY_ROUTER ]
             </div>
             <SnakeGame />
           </div>
        </div>
      </main>
      
    </div>
  );
}
