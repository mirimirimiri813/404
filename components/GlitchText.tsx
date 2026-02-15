import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  intensity?: 'low' | 'high';
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, intensity = 'low' }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (intensity === 'low') return;

    const chars = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ#@!$%^&*';
    const originalText = text;
    
    const interval = setInterval(() => {
      const glitched = originalText.split('').map((char, index) => {
        if (char === ' ') return ' ';
        if (Math.random() < 0.1) {
          return chars[Math.floor(Math.random() * chars.length)];
        }
        return char;
      }).join('');
      setDisplayText(glitched);
    }, 100);

    return () => clearInterval(interval);
  }, [text, intensity]);

  return (
    <span className={`relative inline-block ${intensity === 'high' ? 'animate-pulse text-red-600 font-bold' : ''}`}>
      {displayText}
      {intensity === 'high' && (
        <>
          <span className="absolute top-0 left-0 -translate-x-[2px] text-blue-500 opacity-50 mix-blend-screen animate-pulse pointer-events-none">
            {displayText}
          </span>
          <span className="absolute top-0 left-0 translate-x-[2px] text-red-500 opacity-50 mix-blend-screen animate-pulse pointer-events-none">
            {displayText}
          </span>
        </>
      )}
    </span>
  );
};