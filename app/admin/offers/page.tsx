import { createServerSupabaseClient } from '@/lib/supabase-server'
import { OffersManager } from '@/components/admin/OffersManager'

async function getOffersWithItems() {
  const supabase = createServerSupabaseClient()
  
  // Get all offers with item details
  const { data: offers } = await supabase
    .from('offers')
    .select(`
      *,
      item:items(id, title, reserve_price, offer_tier)
    `)
    .order('created_at', { ascending: false })

  // Group offers by item
  const itemsMap = new Map<string, {
    item: any
    offers: any[]
    pendingCount: number
    highestOffer: number
  }>()

  offers?.forEach((offer) => {
    if (!offer.item) return
    
    const itemId = offer.item.id
    if (!itemsMap.has(itemId)) {
      itemsMap.set(itemId, {
        item: offer.item,
        offers: [],
        pendingCount: 0,
        highestOffer: 0,
      })
    }
    
    const itemData = itemsMap.get(itemId)!
    itemData.offers.push(offer)
    
    if (offer.status === 'pending') {
      itemData.pendingCount++
      if (offer.offer_amount > itemData.highestOffer) {
        itemData.highestOffer = offer.offer_amount
      }
    }
  })

  // Convert to array and sort by pending count
  const groupedOffers = Array.from(itemsMap.values())
    .sort((a, b) => b.pendingCount - a.pendingCount)

  return {
    grouped: groupedOffers,
    all: offers || [],
  }
}

async function getOfferStats() {
  const supabase = createServerSupabaseClient()
  
  const { data: offers } = await supabase
    .from('offers')
    .select('status, offer_amount')

  const stats = {
    total: offers?.length || 0,
    pending: 0,
    accepted: 0,
    declined: 0,
    totalValue: 0,
    pendingValue: 0,
  }

  offers?.forEach((offer) => {
    stats.totalValue += Number(offer.offer_amount)
    if (offer.status === 'pending') {
      stats.pending++
      stats.pendingValue += Number(offer.offer_amount)
    } else if (offer.status === 'accepted' || offer.status === 'sold') {
      stats.accepted++
    } else if (offer.status === 'declined') {
      stats.declined++
    }
  })

  return stats
}

export default async function AdminOffersPage() {
  const [offersData, stats] = await Promise.all([
    getOffersWithItems(),
    getOfferStats(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gold-200">Offers</h1>
        <p className="text-stone-500 mt-1">Manage and respond to buyer offers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="admin-card">
          <div className="text-3xl font-display text-gold-400">{stats.pending}</div>
          <div className="text-xs uppercase tracking-wider text-stone-500">Pending</div>
        </div>
        <div className="admin-card">
          <div className="text-3xl font-display text-emerald-400">{stats.accepted}</div>
          <div className="text-xs uppercase tracking-wider text-stone-500">Accepted</div>
        </div>
        <div className="admin-card">
          <div className="text-3xl font-display text-gold-200">
            ${stats.pendingValue.toLocaleString()}
          </div>
          <div className="text-xs uppercase tracking-wider text-stone-500">Pending Value</div>
        </div>
        <div className="admin-card">
          <div className="text-3xl font-display text-stone-400">{stats.total}</div>
          <div className="text-xs uppercase tracking-wider text-stone-500">Total Offers</div>
        </div>
      </div>

      <OffersManager 
        groupedOffers={offersData.grouped} 
        allOffers={offersData.all} 
      />
    </div>
  )
}
