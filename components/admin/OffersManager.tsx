'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  Check, 
  X, 
  MessageSquare,
  DollarSign,
  Clock,
  ExternalLink,
  Send
} from 'lucide-react'

interface Offer {
  id: string
  item_id: string
  name: string
  email: string
  phone?: string
  offer_amount: number
  message?: string
  status: string
  admin_notes?: string
  counter_amount?: number
  stripe_invoice_id?: string
  stripe_invoice_url?: string
  created_at: string
  item?: {
    id: string
    title: string
    reserve_price?: number
  }
}

interface GroupedItem {
  item: {
    id: string
    title: string
    reserve_price?: number
    offer_tier?: string
  }
  offers: Offer[]
  pendingCount: number
  highestOffer: number
}

interface OffersManagerProps {
  groupedOffers: GroupedItem[]
  allOffers: Offer[]
}

export function OffersManager({ groupedOffers, allOffers }: OffersManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [view, setView] = useState<'grouped' | 'all'>('grouped')

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('grouped')}
          className={`px-4 py-2 text-sm ${
            view === 'grouped' 
              ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' 
              : 'text-stone-400 border border-stone-700 hover:border-stone-600'
          }`}
        >
          By Item
        </button>
        <button
          onClick={() => setView('all')}
          className={`px-4 py-2 text-sm ${
            view === 'all' 
              ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' 
              : 'text-stone-400 border border-stone-700 hover:border-stone-600'
          }`}
        >
          All Offers
        </button>
      </div>

      {view === 'grouped' ? (
        <div className="space-y-4">
          {groupedOffers.length === 0 ? (
            <div className="admin-card text-center py-12">
              <DollarSign className="mx-auto text-stone-600 mb-4" size={48} />
              <p className="text-stone-500">No offers yet</p>
            </div>
          ) : (
            groupedOffers.map(({ item, offers, pendingCount, highestOffer }) => (
              <div key={item.id} className="admin-card p-0 overflow-hidden">
                {/* Item Header */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-dgw-charcoal-light transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h3 className="font-display text-lg text-gold-200">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-stone-500">
                          Reserve: {item.reserve_price 
                            ? `$${item.reserve_price.toLocaleString()}` 
                            : 'Not set'}
                        </span>
                        {pendingCount > 0 && (
                          <span className="text-gold-400">
                            {pendingCount} pending offer{pendingCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {highestOffer > 0 && (
                          <span className="text-emerald-400">
                            Highest: ${highestOffer.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {pendingCount > 0 && (
                      <span className="bg-gold-400/20 text-gold-400 text-xs px-2 py-1">
                        {pendingCount}
                      </span>
                    )}
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="text-stone-500" size={20} />
                    ) : (
                      <ChevronDown className="text-stone-500" size={20} />
                    )}
                  </div>
                </button>

                {/* Expanded Offers */}
                {expandedItems.has(item.id) && (
                  <div className="border-t border-gold-400/10">
                    {offers
                      .sort((a, b) => b.offer_amount - a.offer_amount)
                      .map((offer) => (
                        <OfferRow key={offer.id} offer={offer} reserve={item.reserve_price} />
                      ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {allOffers.length === 0 ? (
            <div className="admin-card text-center py-12">
              <DollarSign className="mx-auto text-stone-600 mb-4" size={48} />
              <p className="text-stone-500">No offers yet</p>
            </div>
          ) : (
            allOffers.map((offer) => (
              <div key={offer.id} className="admin-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-stone-500">{offer.item?.title}</p>
                    <p className="font-display text-xl text-gold-400">
                      ${offer.offer_amount.toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={offer.status} />
                </div>
                <OfferRow offer={offer} reserve={offer.item?.reserve_price} compact />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function OfferRow({ offer, reserve, compact = false }: { offer: Offer; reserve?: number; compact?: boolean }) {
  const router = useRouter()
  const [isActioning, setIsActioning] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState(offer.admin_notes || '')

  const meetsReserve = reserve && offer.offer_amount >= reserve

  const handleAction = async (action: 'accept' | 'decline' | 'counter', counterAmount?: number) => {
    setIsActioning(true)
    
    try {
      const supabase = createClient()
      
      const updates: any = {
        status: action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'countered',
        responded_at: new Date().toISOString(),
      }

      if (action === 'counter' && counterAmount) {
        updates.counter_amount = counterAmount
      }

      const { error } = await supabase
        .from('offers')
        .update(updates)
        .eq('id', offer.id)

      if (error) throw error

      // If accepting, generate Stripe invoice
      if (action === 'accept') {
        await fetch('/api/offers/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            offer_id: offer.id,
            amount: offer.offer_amount,
            email: offer.email,
            name: offer.name,
            item_title: offer.item?.title,
          }),
        })
      }

      router.refresh()
    } catch (err) {
      console.error('Action error:', err)
      alert('Failed to process action')
    } finally {
      setIsActioning(false)
    }
  }

  const saveNotes = async () => {
    const supabase = createClient()
    await supabase
      .from('offers')
      .update({ admin_notes: notes })
      .eq('id', offer.id)
    router.refresh()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className={`p-4 ${!compact ? 'border-b border-gold-400/5 last:border-0' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Buyer info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {!compact && (
              <span className="font-display text-xl text-gold-400">
                ${offer.offer_amount.toLocaleString()}
              </span>
            )}
            {meetsReserve && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5">
                MEETS RESERVE
              </span>
            )}
            <StatusBadge status={offer.status} />
          </div>
          
          <p className="font-medium text-stone-200">{offer.name}</p>
          
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
            <a 
              href={`mailto:${offer.email}`}
              className="flex items-center gap-1 text-stone-400 hover:text-gold-400"
            >
              <Mail size={14} />
              {offer.email}
            </a>
            {offer.phone && (
              <a 
                href={`tel:${offer.phone}`}
                className="flex items-center gap-1 text-stone-400 hover:text-gold-400"
              >
                <Phone size={14} />
                {offer.phone}
              </a>
            )}
            <span className="flex items-center gap-1 text-stone-500">
              <Clock size={14} />
              {formatDate(offer.created_at)}
            </span>
          </div>

          {offer.message && (
            <p className="mt-2 text-sm text-stone-500 italic">"{offer.message}"</p>
          )}

          {offer.stripe_invoice_url && (
            <a
              href={offer.stripe_invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-gold-400 hover:text-gold-200"
            >
              <ExternalLink size={14} />
              View Invoice
            </a>
          )}
        </div>

        {/* Right: Actions */}
        {offer.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('accept')}
              disabled={isActioning}
              className="p-2 text-emerald-400 hover:bg-emerald-400/10 transition-colors"
              title="Accept & Send Invoice"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => handleAction('decline')}
              disabled={isActioning}
              className="p-2 text-red-400 hover:bg-red-400/10 transition-colors"
              title="Decline"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="p-2 text-stone-400 hover:bg-stone-400/10 transition-colors"
              title="Add Notes"
            >
              <MessageSquare size={20} />
            </button>
            <a
              href={`mailto:${offer.email}?subject=RE: Your offer on ${offer.item?.title || 'item'}&body=Dear ${offer.name},%0D%0A%0D%0AThank you for your offer of $${offer.offer_amount.toLocaleString()} on ${offer.item?.title || 'this item'}.%0D%0A%0D%0A`}
              className="p-2 text-gold-400 hover:bg-gold-400/10 transition-colors"
              title="Reply via Email"
            >
              <Send size={20} />
            </a>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {showNotes && (
        <div className="mt-4 pt-4 border-t border-gold-400/10">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes about this offer..."
            className="input-luxury w-full min-h-[80px] text-sm"
          />
          <button
            onClick={saveNotes}
            className="btn-outline text-sm mt-2"
          >
            Save Notes
          </button>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-gold-400/20 text-gold-400',
    accepted: 'bg-emerald-500/20 text-emerald-400',
    sold: 'bg-emerald-500/20 text-emerald-400',
    declined: 'bg-red-500/20 text-red-400',
    countered: 'bg-blue-500/20 text-blue-400',
    expired: 'bg-stone-500/20 text-stone-400',
  }

  return (
    <span className={`text-xs px-2 py-0.5 uppercase tracking-wider ${styles[status] || styles.pending}`}>
      {status}
    </span>
  )
}
