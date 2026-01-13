import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CategoryCard } from '@/components/CategoryCard'
import { ItemCard } from '@/components/ItemCard'

export const revalidate = 60

async function getCategories() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  return data || []
}

async function getAllItems() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(name, slug),
      images:item_images(*)
    `)
    .eq('is_active', true)
    .eq('is_sold', false)
    .order('is_featured', { ascending: false })
    .order('display_order')
    .limit(50)
  
  return data || []
}

export default async function CategoriesPage() {
  const [categories, items] = await Promise.all([
    getCategories(),
    getAllItems(),
  ])

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="section-label">Our Collections</span>
          <h1 className="font-display text-5xl md:text-6xl text-gold-200 mb-6">
            Browse Inventory
          </h1>
          <div className="gold-line" />
          <p className="text-lg text-stone-400">
            Curated pieces available for immediate acquisition
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-dgw-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* All Items */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label">Available Now</span>
            <h2 className="font-display text-4xl text-gold-200 mb-4">
              All Items
            </h2>
            <div className="gold-line" />
          </div>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-stone-500 mb-4">
                No items currently available
              </p>
              <p className="text-stone-600">
                Check back soon or contact us to discuss your wish list
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
