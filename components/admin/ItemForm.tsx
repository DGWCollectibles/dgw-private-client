'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Item, Category, ItemImage } from '@/lib/supabase'
import { Save, ArrowLeft, Upload, X, Star, Trash2, AlertCircle, Image, Loader2 } from 'lucide-react'

interface ItemFormProps {
  item?: Item & { images?: ItemImage[] }
  categories: Category[]
}

export function ItemForm({ item, categories }: ItemFormProps) {
  const router = useRouter()
  const isEditing = !!item
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    category_id: item?.category_id || '',
    condition: item?.condition || '',
    provenance: item?.provenance || '',
    price: item?.price?.toString() || '',
    price_on_request: item?.price_on_request ?? true,
    reserve_price: (item as any)?.reserve_price?.toString() || '',
    is_featured: item?.is_featured || false,
    is_active: item?.is_active ?? true,
    is_sold: item?.is_sold || false,
  })
  
  const [images, setImages] = useState<ItemImage[]>(item?.images || [])
  const [newImageUrl, setNewImageUrl] = useState('')

  // Handle file upload to Supabase Storage
  const uploadFile = async (file: File): Promise<string | null> => {
    const supabase = createClient()
    
    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `items/${fileName}`

    const { data, error } = await supabase.storage
      .from('item-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  // Handle multiple file uploads
  const handleFiles = async (files: FileList | File[]) => {
    setIsUploading(true)
    setError(null)

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Use JPG, PNG, GIF, or WebP.`)
        return false
      }
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Max 10MB.`)
        return false
      }
      return true
    })

    try {
      const uploadPromises = validFiles.map(file => uploadFile(file))
      const urls = await Promise.all(uploadPromises)
      
      const newImages: ItemImage[] = urls
        .filter((url): url is string => url !== null)
        .map((url, index) => ({
          id: `new-${Date.now()}-${index}`,
          item_id: item?.id || '',
          image_url: url,
          alt_text: null,
          is_primary: images.length === 0 && index === 0,
          display_order: images.length + index,
          created_at: new Date().toISOString(),
        }))

      setImages([...images, ...newImages])
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [images])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const itemData = {
        title: formData.title,
        description: formData.description || null,
        category_id: formData.category_id || null,
        condition: formData.condition || null,
        provenance: formData.provenance || null,
        price: formData.price_on_request ? null : parseFloat(formData.price) || null,
        price_on_request: formData.price_on_request,
        reserve_price: formData.reserve_price ? parseFloat(formData.reserve_price) : null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        is_sold: formData.is_sold,
      }

      let itemId = item?.id

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('items')
          .update(itemData)
          .eq('id', item.id)

        if (updateError) throw updateError
      } else {
        const { data: newItem, error: insertError } = await supabase
          .from('items')
          .insert(itemData)
          .select()
          .single()

        if (insertError) throw insertError
        itemId = newItem.id
      }

      // Handle images
      if (itemId) {
        // Delete removed images
        if (isEditing) {
          const existingImageIds = images.map(img => img.id)
          const originalImageIds = item?.images?.map(img => img.id) || []
          const deletedIds = originalImageIds.filter(id => !existingImageIds.includes(id))
          
          if (deletedIds.length > 0) {
            await supabase.from('item_images').delete().in('id', deletedIds)
          }
        }

        // Update/insert images
        for (let i = 0; i < images.length; i++) {
          const img = images[i]
          if (img.id && !img.id.startsWith('new-')) {
            // Update existing
            await supabase
              .from('item_images')
              .update({ 
                is_primary: img.is_primary, 
                display_order: i 
              })
              .eq('id', img.id)
          } else {
            // Insert new
            await supabase.from('item_images').insert({
              item_id: itemId,
              image_url: img.image_url,
              is_primary: img.is_primary,
              display_order: i,
            })
          }
        }
      }

      router.push('/admin/items')
      router.refresh()
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImageByUrl = () => {
    if (!newImageUrl.trim()) return
    
    const newImage: ItemImage = {
      id: `new-${Date.now()}`,
      item_id: item?.id || '',
      image_url: newImageUrl.trim(),
      alt_text: null,
      is_primary: images.length === 0,
      display_order: images.length,
      created_at: new Date().toISOString(),
    }
    
    setImages([...images, newImage])
    setNewImageUrl('')
  }

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId)
    // If we removed the primary, make the first one primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.is_primary)) {
      updatedImages[0].is_primary = true
    }
    setImages(updatedImages)
  }

  const setPrimaryImage = (imageId: string) => {
    setImages(images.map(img => ({
      ...img,
      is_primary: img.id === imageId,
    })))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <h2 className="font-display text-xl text-gold-200 mb-6">Basic Info</h2>
            
            <div className="space-y-6">
              <div>
                <label className="input-label">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-luxury"
                  placeholder="e.g., 1999 Pokémon Base Set Charizard Holo PSA 10"
                />
              </div>

              <div>
                <label className="input-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-luxury min-h-[150px]"
                  placeholder="Detailed description of the item..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="input-luxury"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Condition</label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="input-luxury"
                    placeholder="e.g., PSA 10 Gem Mint"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Provenance</label>
                <textarea
                  value={formData.provenance}
                  onChange={(e) => setFormData({ ...formData, provenance: e.target.value })}
                  className="input-luxury min-h-[100px]"
                  placeholder="History, previous owners, authentication details..."
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="admin-card">
            <h2 className="font-display text-xl text-gold-200 mb-6">Images</h2>
            
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-none p-8 text-center transition-all duration-200 mb-6 ${
                dragActive 
                  ? 'border-gold-400 bg-gold-400/10' 
                  : 'border-gold-400/30 hover:border-gold-400/50'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="text-gold-400 animate-spin" size={32} />
                  <p className="text-sm text-stone-400">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Image className="text-gold-400" size={32} />
                  <p className="text-sm text-stone-300">
                    Drag & drop images here, or click to browse
                  </p>
                  <p className="text-xs text-stone-500">
                    JPG, PNG, GIF, WebP up to 10MB each
                  </p>
                </div>
              )}
            </div>

            {/* Or add by URL */}
            <div className="flex gap-3 mb-6">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="input-luxury flex-1"
                placeholder="Or paste image URL..."
              />
              <button
                type="button"
                onClick={addImageByUrl}
                className="btn-outline"
              >
                <Upload size={16} />
                Add
              </button>
            </div>

            {/* Image grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-square bg-dgw-charcoal-light overflow-hidden">
                      <img
                        src={img.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Controls */}
                    <div className="absolute inset-0 bg-dgw-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(img.id)}
                        className={`p-2 ${img.is_primary ? 'text-gold-400' : 'text-stone-400 hover:text-gold-400'}`}
                        title={img.is_primary ? 'Primary image' : 'Set as primary'}
                      >
                        <Star size={20} fill={img.is_primary ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="p-2 text-stone-400 hover:text-red-400"
                        title="Remove image"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    {/* Primary badge */}
                    {img.is_primary && (
                      <div className="absolute top-2 left-2 bg-gold-400 text-dgw-black text-[0.6rem] px-2 py-1 uppercase tracking-wider">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 text-center py-8">
                No images yet. Drag & drop or add URLs above.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="admin-card">
            <h2 className="font-display text-xl text-gold-200 mb-6">Pricing</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.price_on_request}
                  onChange={(e) => setFormData({ ...formData, price_on_request: e.target.checked })}
                  className="w-5 h-5 bg-dgw-charcoal border border-gold-400/30 text-gold-400 focus:ring-gold-400"
                />
                <span className="text-sm text-stone-300">Price on Request</span>
              </label>

              {!formData.price_on_request && (
                <div>
                  <label className="input-label">Price (USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-luxury"
                    placeholder="0.00"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gold-400/10">
                <label className="input-label">Reserve Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.reserve_price}
                  onChange={(e) => setFormData({ ...formData, reserve_price: e.target.value })}
                  className="input-luxury"
                  placeholder="Minimum offer to auto-accept"
                />
                <p className="text-xs text-stone-600 mt-2">
                  For items under $2,500: offers at or above this amount will auto-generate a Stripe invoice.
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="admin-card">
            <h2 className="font-display text-xl text-gold-200 mb-6">Status</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 bg-dgw-charcoal border border-gold-400/30 text-gold-400 focus:ring-gold-400"
                />
                <span className="text-sm text-stone-300">Active (visible on site)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5 bg-dgw-charcoal border border-gold-400/30 text-gold-400 focus:ring-gold-400"
                />
                <span className="text-sm text-stone-300">Featured item</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_sold}
                  onChange={(e) => setFormData({ ...formData, is_sold: e.target.checked })}
                  className="w-5 h-5 bg-dgw-charcoal border border-gold-400/30 text-gold-400 focus:ring-gold-400"
                />
                <span className="text-sm text-stone-300">Mark as sold</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
            </button>
            
            <Link href="/admin/items" className="btn-outline w-full text-center">
              <ArrowLeft size={16} />
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
