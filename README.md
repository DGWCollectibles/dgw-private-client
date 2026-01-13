# DGW Private Client

A luxury inventory management and buyer-focused catalog system for DGW Collectibles & Estates.

## Features

### Public Site
- **Homepage** with featured items, category grid, services, and contact form
- **Category pages** with item listings
- **Item detail pages** with inquiry forms
- **Gold particle effects** and luxury dark theme
- **Responsive design** for all devices

### Admin Panel (`/admin`)
- **Dashboard** with stats and recent activity
- **Items management** - Add, edit, delete inventory items
- **Categories management** - Create and organize categories
- **Inquiries management** - Track and respond to buyer inquiries
- **Image management** - Add multiple images per item
- **Status controls** - Active/Draft/Sold, Featured badges

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Database + Auth + Storage)
- **Tailwind CSS** (Styling)
- **TypeScript**
- **Lucide React** (Icons)

---

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (~2 minutes)

### 2. Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste and run the SQL to create all tables, indexes, and sample data

### 3. Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name it `item-images`
4. Check "Public bucket" for public read access
5. Click Create

### 4. Set Up Admin User

1. Go to **Authentication** > **Users** in Supabase
2. Click **Add User** > **Create New User**
3. Enter your email and password
4. After creating, copy the user's UUID
5. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_users (id, email, role) 
VALUES ('YOUR-USER-UUID-HERE', 'your@email.com', 'admin');
```

### 5. Get API Keys

1. Go to **Settings** > **API** in Supabase
2. Copy:
   - Project URL (`https://xxxxx.supabase.co`)
   - `anon` public key

### 6. Configure Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 7. Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit:
- **Public site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Usage Guide

### Adding Items

1. Log in to `/admin`
2. Click **Items** > **Add Item**
3. Fill in:
   - Title (required)
   - Description
   - Category
   - Condition (e.g., "PSA 10 Gem Mint")
   - Provenance (history/authentication)
4. Add image URLs (paste from Supabase Storage or external hosting)
5. Set status: Active/Draft, Featured, Sold
6. Save

### Managing Inquiries

1. When buyers inquire on items, they appear in **Inquiries**
2. Status workflow: New → Contacted → Closed
3. Click "Reply" to open email client with pre-filled subject

### Image Hosting Options

**Option 1: Supabase Storage**
1. Go to Storage > item-images bucket
2. Upload image
3. Copy public URL
4. Paste in item form

**Option 2: External (Imgur, Cloudinary, etc.)**
1. Upload to external service
2. Copy direct image URL
3. Paste in item form

---

## File Structure

```
dgw-private-client/
├── app/
│   ├── admin/           # Admin panel pages
│   │   ├── items/       # Item management
│   │   ├── categories/  # Category management
│   │   ├── inquiries/   # Inquiry management
│   │   └── login/       # Admin login
│   ├── categories/      # Public category pages
│   ├── items/           # Public item detail pages
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── admin/           # Admin components
│   └── *.tsx            # Shared components
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── supabase-server.ts
├── public/              # Static assets
├── supabase-schema.sql  # Database schema
└── ...config files
```

---

## Customization

### Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  gold: {
    400: '#C9A227',  // Primary gold
    // ...
  }
}
```

### Categories
Default categories are created by the SQL schema. Edit/add via admin panel or SQL.

### Contact Email
Update `info@dgwcollectibles.com` in:
- `components/Footer.tsx`
- `app/page.tsx` (contact section)

---

## Support

Built for DGW Collectibles & Estates
Questions? Contact your developer or open an issue.
