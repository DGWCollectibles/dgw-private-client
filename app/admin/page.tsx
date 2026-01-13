import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Package, FolderOpen, MessageSquare, DollarSign, TrendingUp, Eye } from 'lucide-react'

async function getStats() {
  const supabase = createServerSupabaseClient()
  
  const [itemsResult, categoriesResult, inquiriesResult, newInquiriesResult] = await Promise.all([
    supabase.from('items').select('id, is_sold, is_active', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
    supabase.from('inquiries').select('id', { count: 'exact' }),
    supabase.from('inquiries').select('id', { count: 'exact' }).eq('status', 'new'),
  ])
  
  const items = itemsResult.data || []
  const activeItems = items.filter(i => i.is_active && !i.is_sold).length
  const soldItems = items.filter(i => i.is_sold).length
  
  return {
    totalItems: items.length,
    activeItems,
    soldItems,
    categories: categoriesResult.count || 0,
    totalInquiries: inquiriesResult.count || 0,
    newInquiries: newInquiriesResult.count || 0,
  }
}

async function getRecentInquiries() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  
  return data || []
}

async function getRecentItems() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('items')
    .select(`*, category:categories(name)`)
    .order('created_at', { ascending: false })
    .limit(5)
  
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recentInquiries, recentItems] = await Promise.all([
    getStats(),
    getRecentInquiries(),
    getRecentItems(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gold-200">Dashboard</h1>
        <p className="text-stone-500 mt-1">Welcome to DGW Private Client admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-gold-400" size={24} />
            <span className="text-[0.65rem] tracking-wider uppercase text-emerald-400">Active</span>
          </div>
          <p className="font-display text-4xl text-stone-100">{stats.activeItems}</p>
          <p className="text-sm text-stone-500 mt-1">Items Available</p>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-gold-400" size={24} />
            <span className="text-[0.65rem] tracking-wider uppercase text-stone-500">Sold</span>
          </div>
          <p className="font-display text-4xl text-stone-100">{stats.soldItems}</p>
          <p className="text-sm text-stone-500 mt-1">Items Sold</p>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <FolderOpen className="text-gold-400" size={24} />
          </div>
          <p className="font-display text-4xl text-stone-100">{stats.categories}</p>
          <p className="text-sm text-stone-500 mt-1">Categories</p>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="text-gold-400" size={24} />
            {stats.newInquiries > 0 && (
              <span className="text-[0.65rem] tracking-wider uppercase text-amber-400">
                {stats.newInquiries} new
              </span>
            )}
          </div>
          <p className="font-display text-4xl text-stone-100">{stats.totalInquiries}</p>
          <p className="text-sm text-stone-500 mt-1">Total Inquiries</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-gold-200">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-gold-400 hover:text-gold-200">
              View All →
            </Link>
          </div>
          
          {recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start justify-between pb-4 border-b border-gold-400/5 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-stone-200">{inquiry.name}</p>
                    <p className="text-xs text-stone-500 truncate max-w-[200px]">
                      {inquiry.item_title || 'General inquiry'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`status-badge ${
                      inquiry.status === 'new' ? 'status-new' : 
                      inquiry.status === 'contacted' ? 'status-contacted' : 'status-closed'
                    }`}>
                      {inquiry.status}
                    </span>
                    <p className="text-[0.65rem] text-stone-600 mt-1">
                      {formatDate(inquiry.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">No inquiries yet</p>
          )}
        </div>

        {/* Recent Items */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-gold-200">Recently Added</h2>
            <Link href="/admin/items" className="text-xs text-gold-400 hover:text-gold-200">
              View All →
            </Link>
          </div>
          
          {recentItems.length > 0 ? (
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between pb-4 border-b border-gold-400/5 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-stone-200 truncate max-w-[250px]">{item.title}</p>
                    <p className="text-xs text-stone-500">
                      {item.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.is_sold ? (
                      <span className="status-badge status-closed">Sold</span>
                    ) : item.is_active ? (
                      <span className="status-badge status-new">Active</span>
                    ) : (
                      <span className="status-badge status-contacted">Draft</span>
                    )}
                    <Link 
                      href={`/admin/items/${item.id}`}
                      className="text-stone-500 hover:text-gold-400"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">No items yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 flex gap-4">
        <Link href="/admin/items/new" className="btn-primary">
          Add New Item
        </Link>
        <Link href="/admin/categories" className="btn-outline">
          Manage Categories
        </Link>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffHours < 48) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
