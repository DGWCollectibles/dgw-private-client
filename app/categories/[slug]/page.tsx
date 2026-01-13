import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ItemCard } from '@/components/ItemCard'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 60

async function getCategory(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  return data
}

async function getCategoryItems(categoryId: string) {
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
    .order('is_sold')
    .order('is_featured', { ascending: false })
    .order('display_order')
  
  return data || []
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const category = await getCategory(params.slug)
  
  if (!category) {
    notFound()
  }
  
  const items = await getCategoryItems(category.id)
  const availableItems = items.filter(item => !item.is_sold)
  const soldItems = items.filter(item => item.is_sold)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-gold-400 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            All Collections
          </Link>
          
          <div className="flex items-center gap-6 mb-6">
            <span className="text-6xl">{getCategoryEmoji(category.slug)}</span>
            <div>
              <h1 className="font-display text-5xl md:text-6xl text-gold-200">
                {category.name}
              </h1>
            </div>
          </div>
          
          {category.description && (
            <p className="text-lg text-stone-400 max-w-2xl">
              {category.description}
            </p>
          )}
          
          <div className="mt-8 flex gap-6 text-sm">
            <span className="text-stone-500">
              <span className="text-gold-400 font-semibold">{availableItems.length}</span> available
            </span>
            {soldItems.length > 0 && (
              <span className="text-stone-500">
                <span className="text-stone-400 font-semibold">{soldItems.length}</span> sold
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-16 bg-dgw-charcoal min-h-[50vh]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          {availableItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              
              {/* Sold Items */}
              {soldItems.length > 0 && (
                <div className="mt-24">
                  <h2 className="font-display text-2xl text-stone-500 mb-8 text-center">
                    Recently Sold
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                    {soldItems.slice(0, 6).map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-stone-500 mb-4">
                No items currently available in this category
              </p>
              <p className="text-stone-600 mb-8">
                Check back soon or contact us to discuss your wish list
              </p>
              <Link href="/#contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
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
