import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { DeleteItemButton } from '@/components/admin/DeleteItemButton'

async function getItems() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(name, slug),
      images:item_images(id, image_url, is_primary)
    `)
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function AdminItemsPage() {
  const items = await getItems()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-gold-200">Items</h1>
          <p className="text-stone-500 mt-1">{items.length} total items</p>
        </div>
        <Link href="/admin/items/new" className="btn-primary">
          <Plus size={16} />
          Add Item
        </Link>
      </div>

      {/* Items Table */}
      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const primaryImage = item.images?.find((img: any) => img.is_primary) || item.images?.[0]
              
              return (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-dgw-charcoal-light flex-shrink-0 overflow-hidden">
                        {primaryImage ? (
                          <img 
                            src={primaryImage.image_url} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                            📦
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-stone-200 font-medium line-clamp-1 max-w-[250px]">
                          {item.title}
                        </p>
                        {item.is_featured && (
                          <span className="text-[0.6rem] tracking-wider uppercase text-gold-400">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-stone-400">
                    {item.category?.name || '—'}
                  </td>
                  <td className="text-stone-400 text-sm">
                    {item.condition || '—'}
                  </td>
                  <td>
                    {item.is_sold ? (
                      <span className="status-badge status-closed">Sold</span>
                    ) : item.is_active ? (
                      <span className="status-badge status-new">Active</span>
                    ) : (
                      <span className="status-badge status-contacted">Draft</span>
                    )}
                  </td>
                  <td className="text-stone-500 text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/items/${item.id}`}
                        target="_blank"
                        className="p-2 text-stone-500 hover:text-gold-400 transition-colors"
                        title="View on site"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/items/${item.id}`}
                        className="p-2 text-stone-500 hover:text-gold-400 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteItemButton itemId={item.id} itemTitle={item.title} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 mb-4">No items yet</p>
            <Link href="/admin/items/new" className="btn-outline">
              Add Your First Item
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
