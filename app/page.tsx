import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ItemCard } from '@/components/ItemCard'
import { CategoryCard } from '@/components/CategoryCard'
import { Shield, Eye, Truck, Search, ArrowRight } from 'lucide-react'

export const revalidate = 60

async function getFeaturedItems() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(name, slug),
      images:item_images(*)
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .eq('is_sold', false)
    .order('display_order')
    .limit(6)
  
  return data || []
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

export default async function HomePage() {
  const [featuredItems, categories] = await Promise.all([
    getFeaturedItems(),
    getCategories(),
  ])

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Breathing ambient glow */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(201,176,55,0.08) 0%, transparent 60%)',
          }}
        />
        
        {/* Light rays from above */}
        <div className="absolute top-0 left-1/3 w-px h-[500px] opacity-[0.04]" style={{
          background: 'linear-gradient(180deg, rgba(201,176,55,0.8) 0%, transparent 100%)',
        }} />
        <div className="absolute top-0 right-1/4 w-px h-[400px] opacity-[0.03]" style={{
          background: 'linear-gradient(180deg, rgba(201,176,55,0.8) 0%, transparent 100%)',
        }} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32">
          {/* Badge */}
          <span 
            className="inline-block text-[0.6rem] font-medium tracking-[0.5em] uppercase text-gold-400 px-8 py-3 border border-gold-400/30 mb-10 animate-fade-in relative overflow-hidden"
          >
            <span className="relative z-10">DGW Private Client Services</span>
            <span 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(201,176,55,0.1), transparent)',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />
          </span>
          
          {/* Main heading */}
          <h1 
            className="font-display text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text mb-8 tracking-wide animate-fade-in-up"
            style={{
              backgroundImage: 'linear-gradient(180deg, #E5C687 0%, #C9B037 50%, #A89020 100%)',
              animationDelay: '0.2s',
              opacity: 0,
            }}
          >
            Acquire Exceptional Pieces
          </h1>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <span className="text-gold-400/40 animate-diamond-pulse">◆</span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
            <span className="text-gold-400/40 animate-diamond-pulse" style={{ animationDelay: '0.3s' }}>◆</span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
            <span className="text-gold-400/40 animate-diamond-pulse" style={{ animationDelay: '0.6s' }}>◆</span>
          </div>
          
          {/* Subtitle */}
          <p 
            className="font-display text-xl md:text-2xl text-stone-400 italic mb-14 animate-fade-in-up"
            style={{ animationDelay: '0.5s', opacity: 0 }}
          >
            Curated inventory for distinguished collectors
          </p>
          
          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up"
            style={{ animationDelay: '0.7s', opacity: 0 }}
          >
            <Link href="/categories" className="btn-primary">
              <span>Browse Collections</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="#sell" className="btn-outline">
              Sell With Us
            </Link>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="text-[0.6rem] tracking-[0.4em] uppercase text-stone-600">
              Explore
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-gold-400 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ==================== FEATURED ITEMS ==================== */}
      {featuredItems.length > 0 && (
        <section className="relative z-10 py-28 bg-gradient-to-b from-[#0a0908] to-[#0f0d0c]">
          {/* Top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
          
          {/* Section glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(201,176,55,0.04) 0%, transparent 60%)',
            }}
          />
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="section-label">Featured Pieces</span>
              <h2 className="font-display text-4xl md:text-5xl text-gold-200 mb-4">
                Recently Added
              </h2>
              <div className="gold-line" />
              <p className="text-stone-400 max-w-xl mx-auto">
                Hand-selected pieces from our current inventory
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item, index) => (
                <ItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
            
            <div className="text-center mt-14">
              <Link href="/categories" className="btn-outline">
                View All Items
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================== CATEGORIES GRID ==================== */}
      <section className="relative z-10 py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label">Collections</span>
            <h2 className="font-display text-4xl md:text-5xl text-gold-200 mb-4">
              Browse by Category
            </h2>
            <div className="gold-line" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY DGW ==================== */}
      <section id="services" className="relative z-10 py-28 bg-gradient-to-b from-[#0f0d0c] to-[#0a0908]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label">Why DGW</span>
            <h2 className="font-display text-4xl md:text-5xl text-gold-200 mb-4">
              The Private Client Advantage
            </h2>
            <div className="gold-line" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Authentication', desc: 'Every piece verified by experts with documentation and provenance research.' },
              { icon: Eye, title: 'Discretion', desc: 'Private transactions with complete confidentiality for buyers and sellers.' },
              { icon: Truck, title: 'White-Glove Delivery', desc: 'Insured shipping with custom packaging for high-value items worldwide.' },
              { icon: Search, title: 'Sourcing', desc: "Can't find what you're looking for? We'll locate it through our network." },
            ].map((item, index) => (
              <div 
                key={item.title}
                className="text-center group"
                style={{
                  animation: 'riseUp 0.6s ease-out forwards',
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-gold-400/20 transition-all duration-500 group-hover:border-gold-400/50 group-hover:shadow-[0_0_30px_rgba(201,176,55,0.1)]">
                  {/* Corner accents */}
                  <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-gold-400/40" />
                  <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-gold-400/40" />
                  <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-gold-400/40" />
                  <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-gold-400/40" />
                  
                  <item.icon className="text-gold-400 transition-transform duration-500 group-hover:scale-110" size={28} />
                </div>
                <h3 className="font-display text-xl text-gold-200 mb-3">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SELL WITH US ==================== */}
      <section id="sell" className="relative z-10 py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-label">For Sellers</span>
          <h2 className="font-display text-4xl md:text-5xl text-gold-200 mb-6">
            Have Something Exceptional?
          </h2>
          <div className="gold-line" />
          <p className="text-lg text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            We work with collectors, estates, and institutions to find the right buyers for exceptional pieces. Competitive consignment rates and access to serious collectors worldwide.
          </p>
          <Link href="#contact" className="btn-primary">
            Discuss Consignment
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section id="contact" className="relative z-10 py-28 bg-gradient-to-b from-[#0f0d0c] to-[#080808]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <div>
              <span className="section-label">Get in Touch</span>
              <h2 className="font-display text-4xl text-gold-200 mb-6">
                Start a Conversation
              </h2>
              <div className="gold-line-left" />
              <p className="text-stone-400 mb-10 leading-relaxed">
                Whether you're looking to acquire, consign, or simply discuss the market, we're here to help. All inquiries are handled with complete confidentiality.
              </p>
              
              <div className="space-y-8">
                {[
                  { emoji: '✉️', label: 'Email', value: 'info@dgwcollectibles.com', href: 'mailto:info@dgwcollectibles.com' },
                  { emoji: '📍', label: 'Location', value: 'Poughkeepsie, New York' },
                  { emoji: '🕐', label: 'Hours', value: 'By Appointment Only' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <h4 className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-stone-600 mb-1">
                        {item.label}
                      </h4>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="text-stone-300 hover:text-gold-400 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-stone-300">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column - Contact Form */}
            <div className="relative bg-gradient-to-b from-[#1a1614] to-[#0f0d0c] border border-gold-400/10 p-8 overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold-400/30" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold-400/30" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-gold-400/30" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold-400/30" />
              
              <form className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input type="text" className="input-luxury" placeholder="John Smith" required />
                  </div>
                  <div>
                    <label className="input-label">Email *</label>
                    <input type="email" className="input-luxury" placeholder="john@example.com" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label">Phone</label>
                    <input type="tel" className="input-luxury" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="input-label">Interest</label>
                    <select className="input-luxury">
                      <option value="">Select...</option>
                      <option value="buy">Looking to Buy</option>
                      <option value="sell">Looking to Sell/Consign</option>
                      <option value="both">Both</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="input-label">Message *</label>
                  <textarea 
                    className="input-luxury min-h-[150px]" 
                    placeholder="Tell us about what you're looking for or what you have..."
                    required
                  />
                </div>
                
                <button type="submit" className="btn-primary w-full">
                  Send Inquiry
                </button>
                
                <p className="text-[0.7rem] text-stone-600 text-center">
                  All inquiries are confidential. We typically respond within 24-48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
