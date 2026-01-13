'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Category } from '@/lib/supabase'

interface CategoryCardProps {
  category: Category
  index?: number
}

const categoryEmojis: Record<string, string> = {
  'tcg': '🎴',
  'sports': '🏆',
  'jewelry': '💎',
  'fine-art': '🎨',
  'watches': '⌚',
  'designer-fashion': '👜',
  'coins': '🪙',
  'curiosities': '🔮',
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const emoji = categoryEmojis[category.slug] || '✨'
  
  return (
    <Link 
      href={`/categories/${category.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `riseUp 0.5s ease-out forwards`,
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
      }}
    >
      <div className="relative h-48 overflow-hidden border border-gold-400/10 transition-all duration-500 group-hover:border-gold-400/40 group-hover:-translate-y-1 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(201,176,55,0.08)]">
        
        {/* Glass case effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1614] via-[#151310] to-[#0f0d0c]" />
        
        {/* Velvet interior */}
        <div 
          className="absolute inset-4 rounded-sm"
          style={{
            background: 'radial-gradient(ellipse at center, #1a1614 0%, #0f0d0c 100%)',
          }}
        />
        
        {/* Spotlight from above */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-full pointer-events-none transition-opacity duration-500"
          style={{
            background: 'linear-gradient(180deg, rgba(201,176,55,0.12) 0%, transparent 50%)',
            opacity: isHovered ? 1 : 0,
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-gold-400/20 transition-colors duration-300 group-hover:border-gold-400/50" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-gold-400/20 transition-colors duration-300 group-hover:border-gold-400/50" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-gold-400/20 transition-colors duration-300 group-hover:border-gold-400/50" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-gold-400/20 transition-colors duration-300 group-hover:border-gold-400/50" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
          {/* Emoji with glow */}
          <div className="relative mb-4">
            {/* Glow underneath */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle, rgba(201,176,55,0.25) 0%, transparent 70%)',
                opacity: isHovered ? 1 : 0.3,
              }}
            />
            <span 
              className="relative text-4xl transition-transform duration-500"
              style={{
                display: 'inline-block',
                transform: isHovered ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
                animation: isHovered ? 'gentleFloat 3s ease-in-out infinite' : 'none',
              }}
            >
              {emoji}
            </span>
          </div>
          
          <h3 className="font-display text-lg text-stone-200 group-hover:text-gold-200 transition-colors duration-300 mb-1">
            {category.name}
          </h3>
          
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-stone-600 group-hover:text-gold-400/60 transition-colors duration-300">
            View Collection
          </span>
        </div>

        {/* Glass reflection */}
        <div 
          className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
          }}
        />
        
        {/* Reflection shadow at bottom */}
        <div 
          className="absolute -bottom-4 left-1/4 right-1/4 h-4 rounded-full transition-opacity duration-500"
          style={{
            background: 'radial-gradient(ellipse, rgba(201,176,55,0.15) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
            filter: 'blur(4px)',
          }}
        />
      </div>
    </Link>
  )
}
