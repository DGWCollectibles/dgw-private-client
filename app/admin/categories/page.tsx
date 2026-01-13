import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CategoryManager } from '@/components/admin/CategoryManager'

async function getCategories() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
  
  return data || []
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gold-200">Categories</h1>
        <p className="text-stone-500 mt-1">Manage collection categories</p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  )
}
