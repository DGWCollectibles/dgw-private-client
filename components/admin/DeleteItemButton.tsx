'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Trash2 } from 'lucide-react'

interface DeleteItemButtonProps {
  itemId: string
  itemTitle: string
}

export function DeleteItemButton({ itemId, itemTitle }: DeleteItemButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${itemTitle}"? This cannot be undone.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = createClient()
      
      // Delete images first (cascade should handle this, but just in case)
      await supabase.from('item_images').delete().eq('item_id', itemId)
      
      // Delete the item
      const { error } = await supabase.from('items').delete().eq('id', itemId)
      
      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete item')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-stone-500 hover:text-red-400 transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  )
}
