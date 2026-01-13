'use client'

import { useState } from 'react'

interface ImageGalleryProps {
  images: Array<{
    id: string
    image_url: string
    alt_text?: string | null
    is_primary?: boolean
  }>
  title: string
  isSold?: boolean
  categoryEmoji?: string
}

export function ImageGallery({ images, title, isSold, categoryEmoji }: ImageGalleryProps) {
  // Sort images so primary is first, then use that order
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return 0
  })
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = sortedImages[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-dgw-charcoal overflow-hidden relative">
        {selectedImage ? (
          <img
            src={selectedImage.image_url}
            alt={selectedImage.alt_text || title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl opacity-30">
            {categoryEmoji || '✨'}
          </div>
        )}
        
        {isSold && (
          <div className="absolute inset-0 bg-dgw-black/80 flex items-center justify-center">
            <span className="text-lg font-medium tracking-[0.2em] uppercase text-gold-400 border-2 border-gold-400 px-8 py-4">
              Sold
            </span>
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square bg-dgw-charcoal overflow-hidden cursor-pointer transition-all ${
                index === selectedIndex 
                  ? 'ring-2 ring-gold-400' 
                  : 'hover:opacity-80'
              }`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || ''}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
