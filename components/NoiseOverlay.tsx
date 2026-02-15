import React from 'react';

export const NoiseOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-50 mix-blend-hard-light" />
      
      {/* Moving scanline bar */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.03)] to-transparent h-[15%] w-full animate-[scanline_8s_linear_infinite] z-40" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)] z-40" />

      {/* Screen flicker simulation */}
      <div className="absolute inset-0 bg-white/5 animate-[flicker_0.15s_infinite] pointer-events-none mix-blend-overlay z-50" />
      
      {/* Grain/Noise */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-[0.05] animate-[noise_0.2s_infinite] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-30 pointer-events-none mix-blend-overlay" />
    </div>
  );
};