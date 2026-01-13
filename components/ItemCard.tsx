'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Item, ItemImage, Category } from '@/lib/supabase'

interface ItemCardProps {
  item: Item & {
    category?: Category
    images?: ItemImage[]
  }
  index?: number
}

export function ItemCard({ item, index = 0 }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const primaryImage = item.images?.find(img => img.is_primary) || item.images?.[0]
  
  return (
    <Link 
      href={`/items/${item.id}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `riseUp 0.6s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
    >
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1614] to-[#0f0d0c] border border-gold-400/10 transition-all duration-500 group-hover:border-gold-400/40 group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(201,176,55,0.1)]">
        
        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/60 z-10" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/60 z-10" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/60 z-10" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/60 z-10" />

        {/* Spotlight effect on hover */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full pointer-events-none transition-opacity duration-500 z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(201,176,55,0.15) 0%, transparent 60%)',
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Image Container - Velvet Display */}
        <div className="relative aspect-square overflow-hidden bg-[#0a0908]">
          {/* Velvet gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0908]/50 pointer-events-none z-[1]" />
          
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || item.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span 
                className="text-6xl opacity-30 transition-all duration-500 group-hover:opacity-50 group-hover:scale-110"
                style={{
                  animation: isHovered ? 'gentleFloat 3s ease-in-out infinite' : 'none',
                }}
              >
                {getCategoryEmoji(item.category?.slug)}
              </span>
            </div>
          )}
          
          {/* Glow underneath item */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-20 pointer-events-none transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at center bottom, rgba(201,176,55,0.2) 0%, transparent 70%)',
              opacity: isHovered ? 1 : 0,
            }}
          />
          
          {/* Sold overlay */}
          {item.is_sold && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <span className="text-sm font-medium tracking-[0.3em] uppercase text-gold-400 border border-gold-400 px-6 py-3">
                Sold
              </span>
            </div>
          )}
          
          {/* Featured badge */}
          {item.is_featured && !item.is_sold && (
            <div className="absolute top-4 left-4 z-10">
              <span 
                className="relative text-[0.6rem] font-medium tracking-[0.2em] uppercase bg-gradient-to-r from-gold-400 to-gold-600 text-black px-4 py-1.5 overflow-hidden inline-block"
              >
                <span className="relative z-10">Featured</span>
                <span 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 2s ease-in-out infinite',
                  }}
                />
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="relative p-6 bg-gradient-to-b from-[#151310] to-[#0f0d0c]">
          {/* Velvet texture hint */}
          <div className="absolute inset-0 opacity-50 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center top, rgba(26,22,20,0.8) 0%, transparent 70%)',
          }} />
          
          <div className="relative z-10">
            {item.category && (
              <span className="text-[0.6rem] font-medium tracking-[0.25em] uppercase text-gold-400 mb-2 block">
                {item.category.name}
              </span>
            )}
            
            <h3 className="font-display text-xl text-stone-200 mb-2 group-hover:text-gold-200 transition-colors duration-300 line-clamp-2">
              {item.title}
            </h3>
            
            {item.condition && (
              <p className="text-sm text-stone-500 mb-4">
                {item.condition}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gold-400/10">
              <span className="text-sm font-medium text-gold-400">
                {item.price_on_request ? 'Price on Request' : formatPrice(item.price)}
              </span>
              
              <span className="text-xs tracking-[0.15em] uppercase text-stone-500 group-hover:text-gold-400 transition-colors duration-300 flex items-center gap-2">
                View
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function getCategoryEmoji(slug?: string): string {
  const emojiMap: Record<string, string> = {
    'tcg': '🎴',
    'sports': '🏆',
    'jewelry': '💎',
    'fine-art': '🎨',
    'watches': '⌚',
    'designer-fashion': '👜',
    'coins': '🪙',
    'curiosities': '🔮',
  }
  return emojiMap[slug || ''] || '✨'
}

function formatPrice(price: number | null): string {
  if (!price) return 'Price on Request'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
