import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions | DGW Private Client',
  description: 'Terms and conditions for DGW Private Client services, offers, and purchases.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-dgw-charcoal-light border-b border-gold-400/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl text-gold-200 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-stone-500 mb-12">
          Last updated: January 5, 2026
        </p>

        <div className="prose prose-invert prose-gold max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">1. Introduction</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                Welcome to DGW Private Client ("DGW," "we," "us," or "our"), operated by DGW Collectibles & Estates. 
                These Terms and Conditions ("Terms") govern your access to and use of our website, services, and 
                any transactions conducted through our platform, including but not limited to the submission of 
                offers, purchases, and inquiries.
              </p>
              <p>
                By accessing our website or submitting an offer, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms. If you do not agree to these Terms, you may not use our services.
              </p>
            </div>
          </section>

          {/* Definitions */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">2. Definitions</h2>
            <div className="text-stone-400 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-stone-300">"Item"</strong> refers to any collectible, luxury good, or other merchandise listed on the DGW Private Client platform.</li>
                <li><strong className="text-stone-300">"Offer"</strong> refers to a monetary proposal submitted by a prospective buyer for the purchase of an Item.</li>
                <li><strong className="text-stone-300">"Reserve Price"</strong> refers to the minimum price established by DGW at which an Item may be sold.</li>
                <li><strong className="text-stone-300">"Binding Offer"</strong> refers to an Offer that, upon acceptance by DGW, creates a legally enforceable obligation to complete the purchase.</li>
                <li><strong className="text-stone-300">"Non-Binding Offer"</strong> refers to an Offer that serves as an expression of interest and does not create a legal obligation upon acceptance.</li>
              </ul>
            </div>
          </section>

          {/* Offer Terms */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">3. Offer Terms & Conditions</h2>
            <div className="text-stone-400 space-y-6">
              
              <div>
                <h3 className="text-xl text-gold-200 mb-3">3.1 Binding Offers (Under $5,000)</h3>
                <p className="mb-3">
                  For Items with a Reserve Price under Five Thousand United States Dollars ($5,000 USD), 
                  any Offer submitted that meets or exceeds the Reserve Price constitutes a <strong className="text-stone-300">Binding Offer</strong>.
                </p>
                <p className="mb-3">
                  Upon submission of a Binding Offer that meets or exceeds the Reserve Price:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The Offer is automatically accepted by DGW.</li>
                  <li>A payment invoice will be automatically generated and sent to the email address provided by the buyer.</li>
                  <li>The buyer is legally obligated to complete payment within three (3) business days of invoice receipt.</li>
                  <li>Failure to complete payment may result in collection action, negative credit reporting, and/or legal proceedings to recover the full purchase amount plus associated costs.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-gold-200 mb-3">3.2 Non-Binding Offers ($5,000 and Above)</h3>
                <p className="mb-3">
                  For Items with a Reserve Price of Five Thousand United States Dollars ($5,000 USD) or more, 
                  all Offers are considered <strong className="text-stone-300">Non-Binding</strong> expressions of interest.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>DGW will review Non-Binding Offers and may accept, decline, or propose a counter-offer at our sole discretion.</li>
                  <li>Acceptance of a Non-Binding Offer initiates a negotiation process and does not create an immediate obligation to purchase.</li>
                  <li>A binding agreement for Items $5,000 and above is only formed upon execution of a separate purchase agreement or completion of payment.</li>
                  <li>DGW reserves the right to require wire transfer or ACH payment for transactions of $5,000 or more.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-gold-200 mb-3">3.3 Offer Submission Requirements</h3>
                <p className="mb-3">
                  By submitting an Offer, you represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are at least eighteen (18) years of age and have the legal capacity to enter into binding contracts.</li>
                  <li>All information provided, including name, email address, phone number, and shipping address, is accurate and complete.</li>
                  <li>You have sufficient funds or credit available to complete the transaction if your Offer is accepted.</li>
                  <li>You understand the binding nature of Offers under $5,000 that meet the Reserve Price.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-gold-200 mb-3">3.4 Multiple Offers</h3>
                <p>
                  Items may receive multiple Offers simultaneously. DGW reserves the right to accept any Offer 
                  at our sole discretion, and the existence of other Offers does not obligate DGW to accept the 
                  highest Offer or any particular Offer. DGW may, but is not obligated to, inform prospective 
                  buyers that an Item has received interest from multiple collectors.
                </p>
              </div>

            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">4. Payment Terms</h2>
            <div className="text-stone-400 space-y-4">
              <div>
                <h3 className="text-xl text-gold-200 mb-3">4.1 Payment Methods</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-stone-300">Transactions under $5,000:</strong> Payment via credit card, debit card, or ACH through our secure Stripe payment portal.</li>
                  <li><strong className="text-stone-300">Transactions $5,000 - $10,000:</strong> Payment via credit card, wire transfer, or ACH.</li>
                  <li><strong className="text-stone-300">Transactions over $10,000:</strong> Payment via wire transfer or ACH only. Additional verification may be required.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl text-gold-200 mb-3">4.2 Payment Timeline</h3>
                <p>
                  Payment must be completed within three (3) business days of invoice receipt for Binding Offers. 
                  For Non-Binding Offers that proceed to purchase, payment terms will be specified in the 
                  purchase agreement or invoice.
                </p>
              </div>

              <div>
                <h3 className="text-xl text-gold-200 mb-3">4.3 Default & Collections</h3>
                <p>
                  Failure to complete payment on a Binding Offer constitutes a breach of contract. DGW reserves 
                  the right to pursue all available legal remedies, including but not limited to collection 
                  agency referral, credit reporting, and litigation. The defaulting buyer shall be responsible 
                  for all collection costs, attorney fees, and court costs incurred by DGW.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">5. Shipping & Delivery</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                All Items are shipped from our facility in Poughkeepsie, New York (ZIP 12603). Shipping costs 
                are calculated based on Item value, destination, and shipping method.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-stone-300">Items under $200:</strong> USPS Ground Advantage with insurance.</li>
                <li><strong className="text-stone-300">Items $200 - $4,999:</strong> USPS Priority Mail with full insurance.</li>
                <li><strong className="text-stone-300">Items $5,000 - $10,000:</strong> UPS Next Day Saver with full insurance and signature required.</li>
                <li><strong className="text-stone-300">Items over $10,000:</strong> UPS Next Day Air with private insurance, signature required, and possible white-glove delivery.</li>
              </ul>
              <p>
                Risk of loss passes to the buyer upon delivery to the carrier. DGW is not responsible for 
                delays, loss, or damage caused by the shipping carrier, though we will assist with insurance 
                claims as applicable.
              </p>
            </div>
          </section>

          {/* Returns */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">6. Returns & Refunds</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                All sales are final. Due to the unique nature of collectible and luxury items, DGW does not 
                accept returns or issue refunds except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Item received is materially different from the description provided.</li>
                <li>The Item is damaged during shipping (subject to carrier insurance claim approval).</li>
                <li>Authentication concerns arise within seven (7) days of receipt, supported by documentation from a recognized authentication service.</li>
              </ul>
              <p>
                Any approved refund will be processed to the original payment method within ten (10) business 
                days of DGW receiving the returned Item in its original condition.
              </p>
            </div>
          </section>

          {/* Authentication */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">7. Authentication & Condition</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                DGW makes every effort to accurately describe and authenticate all Items. Graded Items 
                (PSA, CGC, BGS, etc.) are sold as graded by the respective authentication service. DGW 
                does not guarantee future grades upon resubmission.
              </p>
              <p>
                Item descriptions and condition reports are provided in good faith based on our professional 
                assessment. Minor variations in color, size, or appearance may occur due to photography, 
                monitor settings, or the inherent nature of vintage and collectible items.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">8. Privacy & Confidentiality</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                DGW respects your privacy. All personal information collected through Offers, inquiries, 
                and purchases is used solely for transaction processing, communication, and shipping purposes. 
                We do not sell or share your personal information with third parties except as necessary to 
                complete transactions (e.g., payment processors, shipping carriers).
              </p>
              <p>
                All client transactions and collection details are treated as confidential.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">9. Limitation of Liability</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, DGW COLLECTIBLES & ESTATES SHALL NOT BE LIABLE FOR 
                ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR 
                RELATED TO YOUR USE OF OUR SERVICES OR ANY TRANSACTION CONDUCTED THROUGH OUR PLATFORM.
              </p>
              <p>
                DGW's total liability for any claim arising from a transaction shall not exceed the purchase 
                price of the Item in question.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">10. Governing Law & Disputes</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of 
                New York, without regard to its conflict of law provisions. Any dispute arising from these 
                Terms or any transaction shall be resolved exclusively in the state or federal courts located 
                in Dutchess County, New York.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">11. Modifications</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                DGW reserves the right to modify these Terms at any time. Changes will be effective upon 
                posting to this page with an updated "Last updated" date. Your continued use of our services 
                after any modification constitutes acceptance of the revised Terms.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-gold-400 mb-4">12. Contact Information</h2>
            <div className="text-stone-400 space-y-4">
              <p>
                For questions regarding these Terms or any transaction, please contact us:
              </p>
              <div className="bg-dgw-charcoal-light border border-gold-400/10 p-6 mt-4">
                <p className="text-gold-200 font-display text-lg mb-2">DGW Collectibles & Estates</p>
                <p>Email: info@dgwcollectibles.com</p>
                <p>Location: Poughkeepsie, New York</p>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-12 bg-gold-400/5 border border-gold-400/20 p-6">
            <h2 className="font-display text-2xl text-gold-400 mb-4">Acknowledgment</h2>
            <div className="text-stone-300 space-y-4">
              <p>
                By submitting an Offer through DGW Private Client, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and Conditions, including specifically 
                the binding nature of Offers under $5,000 that meet the Reserve Price.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
