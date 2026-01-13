'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Check, AlertCircle, Send, ChevronDown, ChevronUp } from 'lucide-react'

interface OfferFormProps {
  itemId: string
  itemTitle: string
  reservePrice?: number | null
  offerTier?: 'standard' | 'premium' | 'white_glove' | null
}

export function OfferForm({ itemId, itemTitle, reservePrice, offerTier }: OfferFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showShipping, setShowShipping] = useState(false)
  const [result, setResult] = useState<{
    type: 'success' | 'invoice' | 'error'
    message: string
    invoiceUrl?: string
  } | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    offer_amount: '',
    message: '',
    // Shipping fields
    shipping_address1: '',
    shipping_address2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_country: 'US',
    // Terms agreement
    agreed_to_terms: false,
  })

  // Determine tier based on reserve price if not explicitly set
  const effectiveTier = offerTier || (
    reservePrice && reservePrice >= 25000 ? 'white_glove' :
    reservePrice && reservePrice >= 5000 ? 'premium' : 
    'standard'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreed_to_terms) {
      setResult({ type: 'error', message: 'You must agree to the Terms & Conditions to submit an offer.' })
      return
    }

    setIsSubmitting(true)
    setResult(null)

    const offerAmount = parseFloat(formData.offer_amount.replace(/[^0-9.]/g, ''))
    
    if (isNaN(offerAmount) || offerAmount <= 0) {
      setResult({ type: 'error', message: 'Please enter a valid offer amount' })
      setIsSubmitting(false)
      return
    }

    // Validate shipping for offers that might be auto-accepted
    if (effectiveTier === 'standard' && (!formData.shipping_address1 || !formData.shipping_city || !formData.shipping_state || !formData.shipping_zip)) {
      setResult({ type: 'error', message: 'Please provide your complete shipping address' })
      setIsSubmitting(false)
      return
    }

    try {
      // Submit offer to API
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: itemId,
          item_title: itemTitle,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          offer_amount: offerAmount,
          message: formData.message.trim() || null,
          shipping: {
            address1: formData.shipping_address1.trim(),
            address2: formData.shipping_address2.trim() || null,
            city: formData.shipping_city.trim(),
            state: formData.shipping_state.trim(),
            zip: formData.shipping_zip.trim(),
            country: formData.shipping_country,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit offer')
      }

      // Check if auto-invoice was generated
      if (data.invoice_url) {
        setResult({
          type: 'invoice',
          message: 'Your offer has been accepted! Complete your purchase:',
          invoiceUrl: data.invoice_url,
        })
      } else {
        setResult({
          type: 'success',
          message: 'Thank you for your offer. We\'ll review it and be in touch within 24 hours.',
        })
      }

      // Reset form
      setFormData({
        name: '', email: '', phone: '', offer_amount: '', message: '',
        shipping_address1: '', shipping_address2: '', shipping_city: '',
        shipping_state: '', shipping_zip: '', shipping_country: 'US',
        agreed_to_terms: false,
      })
      
    } catch (err: any) {
      console.error('Offer error:', err)
      setResult({
        type: 'error',
        message: err.message || 'Failed to submit offer. Please email us directly.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^0-9]/g, '')
    if (!num) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseInt(num))
  }

  // Success/Invoice state
  if (result?.type === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 text-center">
        <Check className="mx-auto text-emerald-400 mb-3" size={32} />
        <h3 className="font-display text-xl text-emerald-400 mb-2">Offer Received</h3>
        <p className="text-sm text-stone-400">{result.message}</p>
      </div>
    )
  }

  if (result?.type === 'invoice') {
    return (
      <div className="bg-gold-400/10 border border-gold-400/30 p-6 text-center">
        <Check className="mx-auto text-gold-400 mb-3" size={32} />
        <h3 className="font-display text-xl text-gold-400 mb-2">Offer Accepted!</h3>
        <p className="text-sm text-stone-400 mb-4">{result.message}</p>
        <a
          href={result.invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Complete Purchase
        </a>
      </div>
    )
  }

  // Closed state - button only
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary w-full"
      >
        <DollarSign size={16} />
        Make an Offer
      </button>
    )
  }

  // Open state - form
  return (
    <div className="bg-dgw-charcoal-light border border-gold-400/10 p-6">
      <h3 className="font-display text-xl text-gold-200 mb-1">Make an Offer</h3>
      <p className="text-sm text-stone-500 mb-6">{itemTitle}</p>
      
      {result?.type === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-400">{result.message}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Offer Amount - Prominent */}
        <div>
          <label className="input-label">Your Offer *</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400" size={18} />
            <input
              type="text"
              required
              value={formData.offer_amount}
              onChange={(e) => setFormData({ 
                ...formData, 
                offer_amount: formatCurrency(e.target.value) 
              })}
              className="input-luxury pl-10 text-xl font-display text-gold-200"
              placeholder="$0"
            />
          </div>
          {effectiveTier === 'standard' && (
            <p className="text-xs text-stone-500 mt-1">
              Offers meeting our reserve are automatically accepted and binding per our{' '}
              <Link href="/terms" target="_blank" className="text-gold-400 hover:text-gold-200">Terms</Link>.
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-luxury"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="input-label">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-luxury"
              placeholder="john@example.com"
            />
          </div>
        </div>
        
        <div>
          <label className="input-label">Phone (Optional)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-luxury"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Shipping Address Section */}
        <div className="border-t border-gold-400/10 pt-4">
          <button
            type="button"
            onClick={() => setShowShipping(!showShipping)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="input-label mb-0">Shipping Address {effectiveTier === 'standard' ? '*' : '(Optional)'}</span>
            {showShipping ? <ChevronUp size={16} className="text-stone-500" /> : <ChevronDown size={16} className="text-stone-500" />}
          </button>
          
          {(showShipping || effectiveTier === 'standard') && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="input-label">Street Address *</label>
                <input
                  type="text"
                  required={effectiveTier === 'standard'}
                  value={formData.shipping_address1}
                  onChange={(e) => setFormData({ ...formData, shipping_address1: e.target.value })}
                  className="input-luxury"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="input-label">Apt / Suite / Unit</label>
                <input
                  type="text"
                  value={formData.shipping_address2}
                  onChange={(e) => setFormData({ ...formData, shipping_address2: e.target.value })}
                  className="input-luxury"
                  placeholder="Apt 4B"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="input-label">City *</label>
                  <input
                    type="text"
                    required={effectiveTier === 'standard'}
                    value={formData.shipping_city}
                    onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                    className="input-luxury"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="input-label">State *</label>
                  <input
                    type="text"
                    required={effectiveTier === 'standard'}
                    value={formData.shipping_state}
                    onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
                    className="input-luxury"
                    placeholder="NY"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="input-label">ZIP *</label>
                  <input
                    type="text"
                    required={effectiveTier === 'standard'}
                    value={formData.shipping_zip}
                    onChange={(e) => setFormData({ ...formData, shipping_zip: e.target.value })}
                    className="input-luxury"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="input-label">Message (Optional)</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="input-luxury min-h-[80px]"
            placeholder="Any additional details..."
          />
        </div>

        {/* Terms Agreement */}
        <div className="bg-dgw-charcoal border border-gold-400/10 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreed_to_terms}
              onChange={(e) => setFormData({ ...formData, agreed_to_terms: e.target.checked })}
              className="mt-1 w-4 h-4 accent-gold-400"
              required
            />
            <span className="text-sm text-stone-400">
              I have read and agree to the{' '}
              <Link href="/terms" target="_blank" className="text-gold-400 hover:text-gold-200 underline">
                Terms & Conditions
              </Link>
              , including that offers under $5,000 meeting the reserve price are binding and will result in an automatic invoice.
            </span>
          </label>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setResult(null)
            }}
            className="btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Offer
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-stone-600 text-center">
          All offers are reviewed within 24 hours. Your information is kept confidential.
        </p>
      </form>
    </div>
  )
}
