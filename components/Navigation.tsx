'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#080808]/95 backdrop-blur-md border-b border-gold-400/10' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative">
            <span className="font-display text-2xl tracking-[0.15em] text-gold-400 transition-all duration-300 group-hover:text-gold-200">
              DGW
            </span>
            <span className="hidden sm:inline font-display text-lg text-stone-500 ml-2 tracking-wider">
              Private Client
            </span>
            {/* Shimmer effect on hover */}
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(201,176,55,0.1), transparent)',
                animation: 'shimmer 2s ease-in-out',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="/" active={isActive('/')} exact>
              Home
            </NavLink>
            <NavLink href="/categories" active={isActive('/categories')}>
              Collections
            </NavLink>
            <NavLink href="/#services" active={false}>
              Services
            </NavLink>
            <NavLink href="/#contact" active={false}>
              Contact
            </NavLink>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link 
              href="/#contact"
              className="relative px-6 py-2.5 text-[0.65rem] font-medium tracking-[0.2em] uppercase text-gold-400 border border-gold-400/40 transition-all duration-300 hover:bg-gold-400/10 hover:border-gold-400 overflow-hidden group"
            >
              <span className="relative z-10">Inquire</span>
              <span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(201,176,55,0.1), transparent)',
                }}
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-stone-400 hover:text-gold-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileMenuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-6 pb-6 border-t border-gold-400/10 pt-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/categories" onClick={() => setMobileMenuOpen(false)}>
                Collections
              </MobileNavLink>
              <MobileNavLink href="/#services" onClick={() => setMobileMenuOpen(false)}>
                Services
              </MobileNavLink>
              <MobileNavLink href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </MobileNavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function NavLink({ 
  href, 
  children, 
  active,
  exact = false 
}: { 
  href: string
  children: React.ReactNode
  active: boolean
  exact?: boolean
}) {
  return (
    <Link 
      href={href}
      className={`relative text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-300 py-2 ${
        active 
          ? 'text-gold-400' 
          : 'text-stone-400 hover:text-gold-400'
      }`}
    >
      {children}
      {/* Active indicator */}
      <span 
        className={`absolute -bottom-1 left-0 h-px bg-gold-400 transition-all duration-300 ${
          active ? 'w-full' : 'w-0'
        }`}
      />
      {/* Hover indicator */}
      <span 
        className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400/50 transition-all duration-300 group-hover:w-full"
      />
    </Link>
  )
}

function MobileNavLink({ 
  href, 
  children, 
  onClick 
}: { 
  href: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="text-sm tracking-[0.15em] uppercase text-stone-400 hover:text-gold-400 transition-colors py-2"
    >
      {children}
    </Link>
  )
}
