import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { InquiryStatusButton } from '@/components/admin/InquiryStatusButton'
import { Mail, Phone, ExternalLink } from 'lucide-react'

async function getInquiries() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('inquiries')
    .select(`
      *,
      item:items(id, title)
    `)
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries()
  
  const newCount = inquiries.filter(i => i.status === 'new').length
  const contactedCount = inquiries.filter(i => i.status === 'contacted').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-gold-200">Inquiries</h1>
          <p className="text-stone-500 mt-1">
            {newCount > 0 && <span className="text-amber-400">{newCount} new</span>}
            {newCount > 0 && contactedCount > 0 && ' · '}
            {contactedCount > 0 && <span>{contactedCount} pending</span>}
            {newCount === 0 && contactedCount === 0 && 'No pending inquiries'}
          </p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="admin-card">
            <div className="flex items-start justify-between gap-6">
              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-xl text-stone-100">
                    {inquiry.name}
                  </h3>
                  <span className={`status-badge ${
                    inquiry.status === 'new' ? 'status-new' : 
                    inquiry.status === 'contacted' ? 'status-contacted' : 'status-closed'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
                
                {/* Contact Info */}
                <div className="flex items-center gap-4 mb-4">
                  <a 
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center gap-2 text-sm text-stone-400 hover:text-gold-400 transition-colors"
                  >
                    <Mail size={14} />
                    {inquiry.email}
                  </a>
                  {inquiry.phone && (
                    <a 
                      href={`tel:${inquiry.phone}`}
                      className="flex items-center gap-2 text-sm text-stone-400 hover:text-gold-400 transition-colors"
                    >
                      <Phone size={14} />
                      {inquiry.phone}
                    </a>
                  )}
                </div>

                {/* Item */}
                {inquiry.item_title && (
                  <div className="mb-4">
                    <span className="text-[0.65rem] uppercase tracking-wider text-stone-600">
                      Regarding:
                    </span>
                    <p className="text-sm text-stone-300">
                      {inquiry.item_title}
                      {inquiry.item?.id && (
                        <Link 
                          href={`/items/${inquiry.item.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 ml-2 text-gold-400 hover:text-gold-200"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      )}
                    </p>
                  </div>
                )}

                {/* Message */}
                {inquiry.message && (
                  <div className="bg-dgw-charcoal-light p-4 border-l-2 border-gold-400/30">
                    <p className="text-sm text-stone-400 whitespace-pre-line">
                      {inquiry.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-3">
                <span className="text-xs text-stone-600">
                  {formatDate(inquiry.created_at)}
                </span>
                
                <InquiryStatusButton 
                  inquiryId={inquiry.id} 
                  currentStatus={inquiry.status} 
                />
                
                <a
                  href={`mailto:${inquiry.email}?subject=RE: Your DGW Inquiry${inquiry.item_title ? ` - ${inquiry.item_title}` : ''}`}
                  className="btn-outline text-xs py-2 px-4"
                >
                  <Mail size={14} />
                  Reply
                </a>
              </div>
            </div>
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className="admin-card text-center py-12">
            <p className="text-stone-500">No inquiries yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
