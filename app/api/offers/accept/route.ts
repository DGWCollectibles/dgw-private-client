import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offer_id, amount, email, name, item_title } = body

    if (!offer_id || !amount || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 })
    let customer = customers.data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          source: 'dgw_private_client',
        },
      })
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 3,
      metadata: {
        offer_id,
      },
    })

    // Add line item
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description: item_title || 'DGW Private Client Purchase',
    })

    // Finalize and send invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
    await stripe.invoices.sendInvoice(invoice.id)

    // Update offer with invoice details
    const supabase = createServerSupabaseClient()
    await supabase
      .from('offers')
      .update({
        status: 'accepted',
        stripe_invoice_id: finalizedInvoice.id,
        stripe_invoice_url: finalizedInvoice.hosted_invoice_url,
        responded_at: new Date().toISOString(),
      })
      .eq('id', offer_id)

    return NextResponse.json({
      success: true,
      invoice_id: finalizedInvoice.id,
      invoice_url: finalizedInvoice.hosted_invoice_url,
    })

  } catch (error: any) {
    console.error('Accept offer error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
