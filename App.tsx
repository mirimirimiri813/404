import React, { useState, useEffect, useRef } from 'react';
import { NoiseOverlay } from './components/NoiseOverlay';
import { RuleItem } from './components/RuleItem';
import { RULES_DATA } from './constants';
import { Power, Radio, Skull } from 'lucide-react';

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleBoot = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBooted(true);
    }, 2500); // Fake boot time
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);
    }
  };

  if (!booted && !loading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <NoiseOverlay />
        <button 
          onClick={handleBoot}
          className="z-50 group flex flex-col items-center gap-4 text-green-900 hover:text-green-500 transition-colors duration-300"
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

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#a8a8a8] relative overflow-hidden flex items-center justify-center">
      <NoiseOverlay />

      {/* Main CRT Container */}
      <div className="relative w-full max-w-4xl h-[95vh] border-[1px] border-[#333] bg-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,0.9)_inset] rounded-lg overflow-hidden flex flex-col z-10">
        
        {/* Header / Status Bar */}
        <header className="bg-[#111] border-b border-[#222] p-4 flex justify-between items-center z-20 shrink-0">
          <div className="flex items-center gap-2">
            <Radio className={`text-red-500 ${scrollProgress > 0.8 ? 'animate-ping' : 'animate-pulse'}`} size={16} />
            <h1 className="font-terminal text-xl tracking-widest text-gray-400">
              GREY_MANSION_RULES.TXT
            </h1>
          </div>
          <div className="font-terminal text-sm text-gray-600">
            {scrollProgress > 0.9 ? 'RUN' : 'READ_ONLY'}
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
                    <RuleItem key={rule.id} rule={rule} />
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

      </div>
    </div>
  );
};

export default App;