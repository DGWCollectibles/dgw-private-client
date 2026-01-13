'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Send, Check, AlertCircle } from 'lucide-react'

interface InquiryFormProps {
  itemId: string
  itemTitle: string
}

export function InquiryForm({ itemId, itemTitle }: InquiryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from('inquiries')
        .insert({
          item_id: itemId,
          item_title: itemTitle,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message || null,
          status: 'new',
        })

      if (insertError) throw insertError

      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setIsOpen(false)
      }, 5000)
    } catch (err) {
      console.error('Inquiry error:', err)
      setError('Failed to submit inquiry. Please email us directly at info@dgwcollectibles.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 text-center">
        <Check className="mx-auto text-emerald-400 mb-3" size={32} />
        <h3 className="font-display text-xl text-emerald-400 mb-2">Inquiry Sent</h3>
        <p className="text-sm text-stone-400">
          We'll be in touch within 24-48 hours regarding this piece.
        </p>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary w-full"
      >
        <Send size={16} />
        Inquire About This Piece
      </button>
    )
  }

  return (
    <div className="bg-dgw-charcoal-light border border-gold-400/10 p-6">
      <h3 className="font-display text-xl text-gold-200 mb-2">
        Inquire About This Piece
      </h3>
      <p className="text-sm text-stone-500 mb-6">
        {itemTitle}
      </p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <div>
          <label className="input-label">Message (Optional)</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="input-luxury min-h-[100px]"
            placeholder="Any questions or details you'd like to know..."
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </button>
        </div>
        
        <p className="text-[0.65rem] text-stone-600 text-center">
          We typically respond within 24-48 hours. All inquiries are confidential.
        </p>
      </form>
    </div>
  )
}
