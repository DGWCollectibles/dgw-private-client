import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { InquiryForm } from '@/components/InquiryForm'
import { OfferForm } from '@/components/OfferForm'
import { ImageGallery } from '@/components/ImageGallery'
import { ArrowLeft, Shield, Truck, MessageCircle } from 'lucide-react'

export const revalidate = 60

async function getItem(id: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(id, name, slug),
      images:item_images(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()
  
  return data
}

async function getRelatedItems(categoryId: string, currentItemId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(name, slug),
      images:item_images(*)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .eq('is_sold', false)
    .neq('id', currentItemId)
    .limit(3)
  
  return data || []
}

async function getOfferCount(itemId: string) {
  const supabase = createServerSupabaseClient()
  const { count } = await supabase
    .from('offers')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', itemId)
    .eq('status', 'pending')
  
  return count || 0
}

export default async function ItemPage({
  params,
}: {
  params: { id: string }
}) {
  const item = await getItem(params.id)
  
  if (!item) {
    notFound()
  }
  
  const [relatedItems, offerCount] = await Promise.all([
    item.category_id ? getRelatedItems(item.category_id, item.id) : [],
    getOfferCount(item.id),
  ])

  // Determine tier based on reserve price
  const effectiveTier = item.offer_tier || (
    item.reserve_price && item.reserve_price >= 25000 ? 'white_glove' :
    item.reserve_price && item.reserve_price >= 5000 ? 'premium' : 
    'standard'
  )

  const showOfferForm = effectiveTier !== 'white_glove'
  const showInquiryOnly = effectiveTier === 'white_glove'

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-dgw-charcoal-light border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link 
            href={item.category ? `/categories/${item.category.slug}` : '/'}
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft size={16} />
            {item.category ? `Back to ${item.category.name}` : 'Back to Home'}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="w-full">
              <ImageGallery 
                images={item.images || []}
                title={item.title}
                isSold={item.is_sold}
                categoryEmoji={getCategoryEmoji(item.category?.slug)}
              />
            </div>

            {/* Details */}
            <div className="w-full">
              {item.category && (
                <Link 
                  href={`/categories/${item.category.slug}`}
                  className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold-400 hover:text-gold-200 transition-colors"
                >
                  {item.category.name}
                </Link>
              )}
              
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-gold-200 mb-6 mt-2">
                {item.title}
              </h1>
              
              {/* Price - Always "Price on Request" */}
              <div className="mb-8 pb-8 border-b border-gold-400/10">
                <span className="text-2xl text-gold-400 font-display">
                  Price on Request
                </span>
                {/* Subtle interest indicator */}
                {offerCount >= 2 && (
                  <p className="text-sm text-stone-500 mt-2">
                    This piece has received interest from multiple collectors
                  </p>
                )}
              </div>
              
              {/* Condition */}
              {item.condition && (
                <div className="mb-6">
                  <h3 className="text-[0.7rem] font-semibold tracking-wider uppercase text-stone-500 mb-2">
                    Condition
                  </h3>
                  <p className="text-stone-300">{item.condition}</p>
                </div>
              )}
              
              {/* Description */}
              {item.description && (
                <div className="mb-6">
                  <h3 className="text-[0.7rem] font-semibold tracking-wider uppercase text-stone-500 mb-2">
                    Description
                  </h3>
                  <p className="text-stone-400 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              )}
              
              {/* Provenance */}
              {item.provenance && (
                <div className="mb-8">
                  <h3 className="text-[0.7rem] font-semibold tracking-wider uppercase text-stone-500 mb-2">
                    Provenance
                  </h3>
                  <p className="text-stone-400 leading-relaxed whitespace-pre-line">
                    {item.provenance}
                  </p>
                </div>
              )}
              
              {/* CTA Buttons */}
              {!item.is_sold && (
                <div className="space-y-4 mb-8">
                  {showOfferForm && (
                    <OfferForm 
                      itemId={item.id}
                      itemTitle={item.title}
                      reservePrice={item.reserve_price}
                      offerTier={item.offer_tier}
                    />
                  )}
                  {/* Always show inquiry as secondary option, or primary for white glove */}
                  <InquiryForm 
                    itemId={item.id} 
                    itemTitle={item.title} 
                  />
                </div>
              )}

              {item.is_sold && (
                <div className="mb-8 p-6 border border-gold-400/20 bg-gold-400/5 text-center">
                  <p className="text-gold-400 font-display text-xl mb-2">Sold</p>
                  <p className="text-sm text-stone-500">
                    Interested in similar pieces?{' '}
                    <Link href="/#contact" className="text-gold-400 hover:text-gold-200">
                      Contact us
                    </Link>
                  </p>
                </div>
              )}
              
              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gold-400/10">
                <div className="text-center">
                  <Shield className="mx-auto text-gold-400 mb-2" size={20} />
                  <span className="text-[0.65rem] uppercase tracking-wider text-stone-500">
                    Authenticated
                  </span>
                </div>
                <div className="text-center">
                  <Truck className="mx-auto text-gold-400 mb-2" size={20} />
                  <span className="text-[0.65rem] uppercase tracking-wider text-stone-500">
                    Insured Shipping
                  </span>
                </div>
                <div className="text-center">
                  <MessageCircle className="mx-auto text-gold-400 mb-2" size={20} />
                  <span className="text-[0.65rem] uppercase tracking-wider text-stone-500">
                    White Glove Service
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <section className="py-12 md:py-16 bg-dgw-charcoal-light">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-8">
              More from {item.category?.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedItems.map((relatedItem: any) => {
                const relatedPrimaryImage = relatedItem.images?.find((img: any) => img.is_primary) || relatedItem.images?.[0]
                
                return (
                  <Link 
                    key={relatedItem.id}
                    href={`/items/${relatedItem.id}`}
                    className="group"
                  >
                    <div className="aspect-square bg-dgw-charcoal overflow-hidden mb-4">
                      {relatedPrimaryImage ? (
                        <img
                          src={relatedPrimaryImage.image_url}
                          alt={relatedItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                          {getCategoryEmoji(relatedItem.category?.slug)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg text-gold-200 group-hover:text-gold-400 transition-colors">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-stone-500">
                      Price on Request
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
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
    'antiquities': '🏛️',
  }
  return emojiMap[slug || ''] || '✨'
}
