import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ItemForm } from '@/components/admin/ItemForm'

async function getCategories() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  return data || []
}

export default async function NewItemPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gold-200">Add New Item</h1>
        <p className="text-stone-500 mt-1">Create a new item listing</p>
      </div>

      <ItemForm categories={categories} />
    </div>
  )
}
