'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  MessageSquare, 
  DollarSign,
  LogOut,
  ExternalLink
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/items', icon: Package, label: 'Items' },
    { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
    { href: '/admin/offers', icon: DollarSign, label: 'Offers' },
    { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  ]

  return (
    <aside className="admin-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gold-400/10">
        <Link href="/admin" className="block">
          <span className="font-display text-2xl text-gold-200">DGW</span>
          <span className="block text-[0.65rem] tracking-[0.2em] uppercase text-stone-500 mt-1">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* View Site Link */}
      <div className="px-4 pb-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-3 text-sm text-stone-500 hover:text-gold-400 transition-colors"
        >
          <ExternalLink size={16} />
          View Site
        </Link>
      </div>

      {/* User / Sign Out */}
      <div className="p-4 border-t border-gold-400/10">
        <div className="text-xs text-stone-500 mb-3 truncate px-2">
          {userEmail}
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-stone-400 hover:bg-dgw-charcoal-light hover:text-red-400 transition-colors rounded"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
