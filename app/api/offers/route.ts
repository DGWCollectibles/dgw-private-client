import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      item_id, 
      item_title, 
      name, 
      email, 
      phone, 
      offer_amount, 
      message,
      shipping 
    } = body

    // Validate required fields
    if (!item_id || !name || !email || !offer_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Get item details including reserve price
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('id, title, reserve_price, offer_tier, is_sold')
      .eq('id', item_id)
      .single()

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    if (item.is_sold) {
      return NextResponse.json(
        { error: 'This item has already been sold' },
        { status: 400 }
      )
    }

    // Determine tier
    const effectiveTier = item.offer_tier || (
      item.reserve_price && item.reserve_price >= 25000 ? 'white_glove' :
      item.reserve_price && item.reserve_price >= 5000 ? 'premium' : 
      'standard'
    )

    // Check if offer meets reserve for auto-invoice (standard tier only)
    const meetsReserve = item.reserve_price && offer_amount >= item.reserve_price
    const shouldAutoInvoice = effectiveTier === 'standard' && meetsReserve

    let stripeInvoiceId = null
    let stripeInvoiceUrl = null

    // Auto-generate Stripe invoice for qualifying offers
    if (shouldAutoInvoice) {
      try {
        // Find or create Stripe customer with shipping address
        const customers = await stripe.customers.list({ email, limit: 1 })
        let customer = customers.data[0]

        const customerData: Stripe.CustomerCreateParams = {
          email,
          name,
          phone: phone || undefined,
          metadata: {
            source: 'dgw_private_client',
          },
        }

        // Add shipping address if provided
        if (shipping?.address1) {
          customerData.shipping = {
            name,
            phone: phone || undefined,
            address: {
              line1: shipping.address1,
              line2: shipping.address2 || undefined,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zip,
              country: shipping.country || 'US',
            },
          }
          // Also set as default address
          customerData.address = {
            line1: shipping.address1,
            line2: shipping.address2 || undefined,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.zip,
            country: shipping.country || 'US',
          }
        }

        if (!customer) {
          customer = await stripe.customers.create(customerData)
        } else {
          // Update existing customer with shipping info
          customer = await stripe.customers.update(customer.id, {
            name,
            phone: phone || undefined,
            shipping: customerData.shipping,
            address: customerData.address,
          })
        }

        // Create invoice with shipping details shown
        const invoice = await stripe.invoices.create({
          customer: customer.id,
          collection_method: 'send_invoice',
          days_until_due: 3,
          metadata: {
            item_id,
            offer_amount: offer_amount.toString(),
          },
          // Include shipping cost as separate line item if needed
          // For now, just include the item price
        })

        // Add line item
        await stripe.invoiceItems.create({
          customer: customer.id,
          invoice: invoice.id,
          amount: Math.round(offer_amount * 100), // Convert to cents
          currency: 'usd',
          description: item_title || `Item: ${item_id}`,
        })

        // Finalize and send invoice
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
        await stripe.invoices.sendInvoice(invoice.id)

        stripeInvoiceId = finalizedInvoice.id
        stripeInvoiceUrl = finalizedInvoice.hosted_invoice_url
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError)
        // Continue without auto-invoice - will be handled manually
      }
    }

    // Insert offer into database with shipping info
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .insert({
        item_id,
        name,
        email,
        phone,
        offer_amount,
        message,
        // Shipping fields
        shipping_address1: shipping?.address1 || null,
        shipping_address2: shipping?.address2 || null,
        shipping_city: shipping?.city || null,
        shipping_state: shipping?.state || null,
        shipping_zip: shipping?.zip || null,
        shipping_country: shipping?.country || 'US',
        // Status
        status: shouldAutoInvoice && stripeInvoiceId ? 'accepted' : 'pending',
        stripe_invoice_id: stripeInvoiceId,
        stripe_invoice_url: stripeInvoiceUrl,
      })
      .select()
      .single()

    if (offerError) {
      console.error('Database error:', offerError)
      return NextResponse.json(
        { error: 'Failed to save offer' },
        { status: 500 }
      )
    }

    // Return response
    return NextResponse.json({
      success: true,
      offer_id: offer.id,
      auto_accepted: shouldAutoInvoice && stripeInvoiceId,
      invoice_url: stripeInvoiceUrl,
    })

  } catch (error: any) {
    console.error('Offer submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch offers (admin only)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('item_id')
  const status = searchParams.get('status')

  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('offers')
    .select(`
      *,
      item:items(id, title, reserve_price)
    `)
    .order('created_at', { ascending: false })

  if (itemId) {
    query = query.eq('item_id', itemId)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ offers: data })
}
