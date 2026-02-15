import React, { useState, useEffect, useRef } from 'react';
import { NoiseOverlay } from './components/NoiseOverlay';
import { RuleItem } from './components/RuleItem';
import { RULES_DATA } from './constants';
import { Power, Radio, Skull, Volume2, VolumeX, AlertTriangle, Clock } from 'lucide-react';
import { audioManager } from './utils/audio';

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [systemFailure, setSystemFailure] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Idle State Management
  const [idleTime, setIdleTime] = useState(0);
  const [headerText, setHeaderText] = useState("GREY_MANSION_RULES.TXT");
  const [currentTime, setCurrentTime] = useState("00:00");

  // Idle timer logic
  useEffect(() => {
    if (!booted || systemFailure) return;

    let heartbeatInterval: any = null;

    const timer = setInterval(() => {
        setIdleTime(prev => {
            const newTime = prev + 1;
            
            // Trigger heartbeat sound if idle for too long
            if (newTime > 5) {
                const intensity = Math.min((newTime - 5) / 20, 1.0); // Ramp up to 1.0 over 20s
                if (newTime % 2 === 0) { // Rhythm
                    audioManager.playHeartbeat(intensity);
                }
            }
            return newTime;
        });
    }, 1000);

    const resetIdle = () => setIdleTime(0);

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('click', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('scroll', resetIdle);
    // Mobile touch events
    window.addEventListener('touchstart', resetIdle);
    window.addEventListener('touchmove', resetIdle);

    return () => {
        clearInterval(timer);
        window.removeEventListener('mousemove', resetIdle);
        window.removeEventListener('click', resetIdle);
        window.removeEventListener('keydown', resetIdle);
        window.removeEventListener('scroll', resetIdle);
        window.removeEventListener('touchstart', resetIdle);
        window.removeEventListener('touchmove', resetIdle);
    };
  }, [booted, systemFailure]);

  // Glitched Clock & Header Text
  useEffect(() => {
    if (!booted) return;

    const interval = setInterval(() => {
        // Clock Update
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        // Randomly glitch the clock
        if (Math.random() < 0.02) {
            const glitches = ["66:66", "RU:NN", "NO:NOW", "DE:AD", "--:--"];
            setCurrentTime(glitches[Math.floor(Math.random() * glitches.length)]);
        } else {
            setCurrentTime(`${hours}:${minutes}`);
        }

        // Randomly glitch the header
        if (Math.random() < 0.01) {
            const creepyHeaders = ["DONT_LOOK_BEHIND", "THEY_ARE_HERE", "HELP_ME", "RUN_AWAY", "ITS_TOO_LATE"];
            setHeaderText(creepyHeaders[Math.floor(Math.random() * creepyHeaders.length)]);
            setTimeout(() => setHeaderText("GREY_MANSION_RULES.TXT"), 500);
        }

    }, 1000);

    return () => clearInterval(interval);
  }, [booted]);

  // Easter Egg: Random knocking sounds
  useEffect(() => {
    if (!booted || systemFailure) return;

    const interval = setInterval(() => {
        // 5% chance every 10 seconds to hear a knock
        if (Math.random() < 0.05) {
            audioManager.playKnock();
        }
    }, 10000);

    return () => clearInterval(interval);
  }, [booted, systemFailure]);

  const handleBoot = () => {
    // Initialize audio context on user gesture
    audioManager.init();
    audioManager.playBootSequence();
    
    setLoading(true);
    
    // Simulate loading glitches
    let glitchCount = 0;
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        audioManager.playGlitch(0.2);
      }
      glitchCount++;
      if (glitchCount > 15) clearInterval(glitchInterval);
    }, 150);

    setTimeout(() => {
      clearInterval(glitchInterval);
      setLoading(false);
      setBooted(true);
      // Play a confirmation sound
      audioManager.playGlitch(0.1);
    }, 2500); // Fake boot time
  };

  const toggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);
    }
  };

  const handleRuleInteraction = (ruleId: string) => {
    if (ruleId === '3-16') {
        // Trigger System Failure if user clicks the forbidden rule
        audioManager.playScare();
        setSystemFailure(true);
    }
  };

  if (systemFailure) {
    return (
        <div className="h-screen w-screen bg-red-900 flex flex-col items-center justify-center relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-black opacity-30 mix-blend-multiply"></div>
            <div className="z-10 text-center space-y-8 p-10 border-4 border-black bg-red-800 text-black font-terminal transform scale-110">
                <AlertTriangle size={120} className="mx-auto mb-4 animate-bounce" />
                <h1 className="text-6xl font-bold tracking-widest">FATAL ERROR</h1>
                <p className="text-2xl">SYSTEM COMPROMISED BY EXTERNAL ENTITY</p>
                <div className="text-xl mt-8 font-serif-kr">
                    "문 열어 문 열어 문 열어 문 열어 문 열어"
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-12 px-8 py-4 bg-black text-red-600 hover:bg-red-950 border border-red-900 text-xl"
                >
                    REBOOT SYSTEM
                </button>
            </div>
            <NoiseOverlay />
        </div>
    );
  }

  if (!booted && !loading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <NoiseOverlay />
        <button 
          onClick={handleBoot}
          className="z-50 group flex flex-col items-center gap-4 text-green-900 hover:text-green-500 transition-colors duration-300"
          onMouseEnter={() => audioManager.playHover()}
        >
          <Power size={64} className="group-hover:drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]" />
          <span className="font-terminal text-2xl tracking-widest uppercase group-hover:animate-pulse">
            Initialize System
          </span>
        </button>
        <div className="absolute bottom-10 font-terminal text-green-900/50 text-sm">
          GRAY MANSION MANAGEMENT OS v4.04
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-end pb-20 pl-20 relative overflow-hidden">
        <NoiseOverlay />
        <div className="font-terminal text-green-500 text-xl leading-tight">
          <p>LOADING KERNEL...</p>
          <p>MOUNTING VOLUMES...</p>
          <p className="text-red-500">WARNING: CORRUPTED SECTORS FOUND IN BLOCK 4</p>
          <p>BYPASSING SECURITY PROTOCOLS...</p>
          <p>LOADING 'RULES_V4.04.TXT'...</p>
          <p className="animate-pulse mt-4">_</p>
        </div>
      </div>
    );
  }

  // Calculate distortion based on scroll progress
  const distortionStyle = {
    filter: `hue-rotate(${scrollProgress * 40}deg) contrast(${1 + scrollProgress * 0.2})`,
    transform: `scale(${1 + scrollProgress * 0.02})`,
  };
  
  // Calculate paranoia opacity (idle effect)
  const paranoiaOpacity = Math.min(Math.max(0, idleTime - 5) / 10, 0.7);

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#a8a8a8] relative overflow-hidden flex items-center justify-center">
      <NoiseOverlay />

      {/* Paranoia Overlay (Idle Effect) */}
      <div 
        className="fixed inset-0 bg-red-900 mix-blend-multiply pointer-events-none transition-opacity duration-1000 z-40"
        style={{ opacity: paranoiaOpacity }}
      />
      {/* Vignette tightens when idle */}
      <div 
        className="fixed inset-0 bg-[radial-gradient(circle,transparent_20%,#000000_100%)] pointer-events-none transition-opacity duration-1000 z-40"
        style={{ opacity: paranoiaOpacity }}
      />

      {/* Main CRT Container */}
      <div className="relative w-full max-w-4xl h-[95vh] border-[1px] border-[#333] bg-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,0.9)_inset] rounded-lg overflow-hidden flex flex-col z-10 transition-transform duration-1000">
        
        {/* Header / Status Bar */}
        <header className="bg-[#111] border-b border-[#222] p-4 flex justify-between items-center z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Radio className={`text-red-500 ${scrollProgress > 0.8 ? 'animate-ping' : 'animate-pulse'}`} size={16} />
                <h1 className="font-terminal text-xl tracking-widest text-gray-400">
                {headerText}
                </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-terminal text-green-800">
                <Clock size={14} />
                <span>{currentTime}</span>
            </div>
            <button 
                onClick={toggleMute}
                className="text-gray-600 hover:text-gray-300 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="font-terminal text-sm text-gray-600">
                {scrollProgress > 0.9 ? 'RUN' : 'READ_ONLY'}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-8 md:p-12 relative scroll-smooth"
          style={distortionStyle}
        >
          {/* Document Header */}
          <div className="mb-12 text-center border-b-2 border-gray-800 pb-8">
            <h2 className="text-3xl md:text-4xl font-serif-kr font-bold text-gray-200 mb-4 tracking-tighter">
              [필독] 그레이 맨션 관리인 업무 수칙 (ver 4.04)
            </h2>
            <div className="text-sm md:text-base font-serif-kr text-gray-500 max-w-2xl mx-auto leading-relaxed">
              - 이 수칙서는 전임 관리자들이 남긴 메모들로 구성되어 있습니다. 
              <span className="text-red-900/80 mx-1 font-bold">잉크가 번지거나 붉은 펜으로 덧써진 내용</span>은 주의하십시오. 
              본 관리실은 관리인의 실종 및 사망에 대해 책임지지 않습니다.
            </div>
          </div>

          {/* Chapters */}
          <div className="space-y-16 max-w-3xl mx-auto">
            {RULES_DATA.map((chapter, index) => (
              <section key={index} className="relative">
                <h3 className="font-terminal text-2xl text-green-900/60 mb-8 border-l-2 border-green-900/30 pl-4 uppercase">
                  {chapter.title}
                </h3>
                <div className="space-y-4">
                  {chapter.rules.map((rule) => (
                    <RuleItem 
                        key={rule.id} 
                        rule={rule} 
                        onInteract={handleRuleInteraction}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer Warning - Appears at bottom */}
          <div className="mt-24 text-center font-terminal text-xs text-gray-800 pb-12 select-none">
            END OF DOCUMENT
            <br/>
            DO NOT DISTRIBUTE
          </div>
        </div>

        {/* Decorative elements indicating horror */}
        <div className={`absolute top-10 right-10 pointer-events-none transition-opacity duration-1000 ${scrollProgress > 0.5 ? 'opacity-20' : 'opacity-0'}`}>
           <Skull size={200} className="text-red-900 blur-xl" />
        </div>
        
        {/* Random Red Flash Easter Egg Overlay */}
        <div className={`absolute inset-0 bg-red-900 mix-blend-color-burn pointer-events-none transition-opacity duration-75 ${Math.random() > 0.99 ? 'opacity-30' : 'opacity-0'}`}></div>

      </div>
    </div>
  );
};

export default App;