import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Types for our database
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  title: string
  description: string | null
  category_id: string | null
  price: number | null
  reserve_price: number | null
  price_on_request: boolean
  condition: string | null
  provenance: string | null
  specifications: Record<string, any> | null
  is_featured: boolean
  is_sold: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  // Joined fields
  category?: Category
  images?: ItemImage[]
}

export interface ItemImage {
  id: string
  item_id: string
  image_url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
  created_at: string
}

export interface Inquiry {
  id: string
  item_id: string | null
  item_title: string | null
  name: string
  email: string
  phone: string | null
  message: string | null
  status: 'new' | 'contacted' | 'closed'
  notes: string | null
  created_at: string
  updated_at: string
  // Joined fields
  item?: Item
}
