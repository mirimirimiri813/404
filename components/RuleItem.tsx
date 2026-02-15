import React, { useState } from 'react';
import { Rule } from '../types';
import { GlitchText } from './GlitchText';
import { EyeOff, AlertTriangle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface RuleItemProps {
  rule: Rule;
}

export const RuleItem: React.FC<RuleItemProps> = ({ rule }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    audioManager.playHover();
    if (rule.isGlitch) {
        audioManager.playGlitch(0.3);
    }
  };

  // Special handling for Rule 15 (The Glitch Rule)
  if (rule.isGlitch) {
    return (
      <div 
        className="mb-8 p-4 border-l-4 border-red-900 bg-red-950/20 relative overflow-hidden group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start">
          <span className="text-red-600 font-mono mr-3 text-xl font-bold animate-pulse">{rule.number}</span>
          <div className={`font-serif-kr text-lg leading-relaxed text-red-400 ${isHovered ? 'scale-105' : ''} transition-transform duration-700`}>
            {rule.content.substring(0, 20)}
            <GlitchText text={rule.content.substring(20)} intensity="high" />
            {isHovered && (
              <div className="absolute inset-0 flex flex-wrap content-center justify-center opacity-30 pointer-events-none">
                {Array.from({ length: 50 }).map((_, i) => (
                  <span key={i} className="text-xs text-red-500 m-1 font-handwriting">문 열어</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const Note = () => {
    if (!rule.note) return null;

    const getNoteColor = () => {
      switch (rule.note?.type) {
        case 'red': return 'text-red-600 rotate-[-1deg]';
        case 'blue': return 'text-blue-500 rotate-[1deg]';
        case 'black': return 'text-gray-900 bg-gray-200/90 px-1 rotate-[0.5deg]';
        default: return 'text-gray-400';
      }
    };

    const noteClasses = `block mt-2 font-handwriting text-xl tracking-wide ${getNoteColor()} opacity-90 relative`;

    return (
      <span className={noteClasses}>
        {/* Simulate ink bleeding/texture */}
        <span className="absolute inset-0 blur-[0.5px] opacity-50">{rule.note?.text}</span>
        <span className="relative">{rule.note?.text}</span>
      </span>
    );
  };

  return (
    <div 
        className={`mb-6 relative group transition-all duration-500 ${rule.hidden ? 'opacity-0 hover:opacity-100 cursor-help' : 'opacity-100'}`}
        onMouseEnter={() => {
            if (!rule.hidden || (rule.hidden && !isHovered)) {
                audioManager.playHover();
            }
            setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        {/* Number */}
        <span className="font-terminal text-green-700/80 mr-4 text-xl select-none mt-1">
          {rule.number}
        </span>

        {/* Content Container */}
        <div className="flex-1">
          <p className={`font-serif-kr text-gray-300 text-lg leading-relaxed relative ${rule.strikethrough ? 'line-through decoration-2 decoration-black text-gray-600' : ''}`}>
            
            {/* Strikethrough overlay to make it look like ink */}
            {rule.strikethrough && (
              <span className="absolute inset-0 bg-black/80 h-[2px] top-1/2 -translate-y-1/2 transform skew-y-1"></span>
            )}

            {rule.content}
            
            {rule.note?.position === 'inline' && (
               <span className="ml-2 block font-handwriting text-red-500 text-xl">{rule.note.text}</span>
            )}
          </p>

          {rule.strikethrough && rule.note && (
             <div className="mt-1 font-handwriting text-2xl font-bold text-gray-100 relative">
                <span className="absolute -inset-1 bg-black blur-sm -z-10 rounded-sm"></span>
                {rule.note.text}
             </div>
          )}

          {rule.note?.position === 'below' && !rule.strikethrough && <Note />}
        </div>
      </div>

      {/* Hover effects for creepy vibe */}
      <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-900 pointer-events-none">
        <EyeOff size={16} />
      </div>
    </div>
  );
};