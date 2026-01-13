'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ChevronDown } from 'lucide-react'

interface OfferStatusButtonProps {
  offerId: string
  currentStatus: string
  offerEmail: string
  itemTitle: string | null
  amount: number
}

export function OfferStatusButton({ 
  offerId, 
  currentStatus, 
  offerEmail, 
  itemTitle, 
  amount 
}: OfferStatusButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'text-amber-400' },
    { value: 'accepted', label: 'Accepted', color: 'text-emerald-400' },
    { value: 'declined', label: 'Declined', color: 'text-red-400' },
    { value: 'countered', label: 'Countered', color: 'text-blue-400' },
    { value: 'invoice_sent', label: 'Invoice Sent', color: 'text-emerald-400' },
    { value: 'paid', label: 'Paid', color: 'text-emerald-400' },
    { value: 'expired', label: 'Expired', color: 'text-stone-400' },
  ]

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false)
      return
    }

    setIsUpdating(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error('Status update error:', err)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="flex items-center gap-2 text-xs text-stone-400 hover:text-gold-400 transition-colors disabled:opacity-50"
      >
        {isUpdating ? 'Updating...' : 'Change Status'}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 bg-dgw-charcoal border border-gold-400/20 z-20 min-w-[160px]">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-dgw-charcoal-light transition-colors ${
                  status.value === currentStatus ? status.color : 'text-stone-400'
                }`}
              >
                {status.label}
                {status.value === currentStatus && ' ✓'}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
