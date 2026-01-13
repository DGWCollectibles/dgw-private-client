import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ItemForm } from '@/components/admin/ItemForm'

async function getItem(id: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('items')
    .select(`*, images:item_images(*)`)
    .eq('id', id)
    .single()
  
  return data
}

async function getCategories() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  return data || []
}

export default async function EditItemPage({
  params,
}: {
  params: { id: string }
}) {
  const [item, categories] = await Promise.all([
    getItem(params.id),
    getCategories(),
  ])

  if (!item) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gold-200">Edit Item</h1>
        <p className="text-stone-500 mt-1 truncate max-w-lg">{item.title}</p>
      </div>

      <ItemForm item={item} categories={categories} />
    </div>
  )
}
