'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="relative bg-[#0a0908] border-t border-gold-400/10">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-display text-3xl tracking-[0.15em] text-gold-400">
                DGW
              </span>
              <span className="block text-xs tracking-[0.3em] uppercase text-stone-600 mt-1">
                Private Client Services
              </span>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed max-w-sm mb-6">
              Curating exceptional collectibles and luxury pieces for distinguished collectors worldwide. Authentication, discretion, and white-glove service.
            </p>
            
            {/* Decorative element */}
            <div className="flex items-center gap-3 text-gold-400/40">
              <span className="animate-diamond-pulse">◆</span>
              <span className="w-12 h-px bg-gold-400/20" />
              <span className="animate-diamond-pulse" style={{ animationDelay: '0.5s' }}>◆</span>
              <span className="w-12 h-px bg-gold-400/20" />
              <span className="animate-diamond-pulse" style={{ animationDelay: '1s' }}>◆</span>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="text-[0.7rem] font-medium tracking-[0.25em] uppercase text-gold-400 mb-6">
              Collections
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/categories/tcg">TCG</FooterLink>
              <FooterLink href="/categories/sports">Sports Cards</FooterLink>
              <FooterLink href="/categories/watches">Watches</FooterLink>
              <FooterLink href="/categories/jewelry">Fine Jewelry</FooterLink>
              <FooterLink href="/categories/designer-fashion">Designer Fashion</FooterLink>
              <FooterLink href="/categories/coins">Coins</FooterLink>
              <FooterLink href="/categories/curiosities">Curiosities</FooterLink>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[0.7rem] font-medium tracking-[0.25em] uppercase text-gold-400 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <span className="text-[0.65rem] tracking-[0.15em] uppercase text-stone-600 block mb-1">
                  Email
                </span>
                <a 
                  href="mailto:info@dgwcollectibles.com" 
                  className="text-sm text-stone-400 hover:text-gold-400 transition-colors"
                >
                  info@dgwcollectibles.com
                </a>
              </li>
              <li>
                <span className="text-[0.65rem] tracking-[0.15em] uppercase text-stone-600 block mb-1">
                  Location
                </span>
                <span className="text-sm text-stone-400">
                  Poughkeepsie, New York
                </span>
              </li>
              <li>
                <span className="text-[0.65rem] tracking-[0.15em] uppercase text-stone-600 block mb-1">
                  Hours
                </span>
                <span className="text-sm text-stone-400">
                  By Appointment
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold-400/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-600 tracking-wider">
            © {currentYear} DGW Collectibles & Estates. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-stone-600 hover:text-gold-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/admin/login" className="text-xs text-stone-700 hover:text-stone-500 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Ambient glow at bottom */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(201,176,55,0.03) 0%, transparent 70%)',
        }}
      />
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href}
        className="text-sm text-stone-500 hover:text-gold-400 transition-colors duration-300"
      >
        {children}
      </Link>
    </li>
  )
}
