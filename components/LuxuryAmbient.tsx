'use client'

import { useEffect, useRef } from 'react'

export function LuxuryAmbient() {
  return (
    <>
      {/* Fixed ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Main ambient glow */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(201,176,55,0.08) 0%, transparent 70%)',
          }}
        />
        
        {/* Secondary glow */}
        <div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(201,176,55,0.05) 0%, transparent 70%)',
            animationDelay: '4s',
          }}
        />

        {/* Floating dust particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-gold-400"
            style={{
              left: `${(i * 3.7) % 100}%`,
              top: `${(i * 5.3) % 100}%`,
              opacity: 0,
              animation: `dustFloat ${10 + (i % 6) * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Light rays from top */}
        <div 
          className="absolute top-0 left-1/4 w-px h-[300px] opacity-[0.03]"
          style={{
            background: 'linear-gradient(180deg, rgba(201,176,55,0.5) 0%, transparent 100%)',
            animation: 'breathe 6s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute top-0 right-1/3 w-px h-[400px] opacity-[0.03]"
          style={{
            background: 'linear-gradient(180deg, rgba(201,176,55,0.5) 0%, transparent 100%)',
            animation: 'breathe 8s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute top-0 left-1/2 w-px h-[250px] opacity-[0.03]"
          style={{
            background: 'linear-gradient(180deg, rgba(201,176,55,0.5) 0%, transparent 100%)',
            animation: 'breathe 7s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>
    </>
  )
}
