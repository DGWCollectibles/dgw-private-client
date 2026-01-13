-- DGW Private Client Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(12, 2),
    price_on_request BOOLEAN DEFAULT true,
    condition VARCHAR(50),
    provenance TEXT,
    specifications JSONB,
    is_featured BOOLEAN DEFAULT false,
    is_sold BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item images table
CREATE TABLE item_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    item_title VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    status VARCHAR(20) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (uses Supabase Auth, this is for role management)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_featured ON items(is_featured) WHERE is_featured = true;
CREATE INDEX idx_items_active ON items(is_active) WHERE is_active = true;
CREATE INDEX idx_item_images_item ON item_images(item_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and items
CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active items" ON items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view item images" ON item_images
    FOR SELECT USING (true);

-- Public can create inquiries
CREATE POLICY "Public can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Admin full access (check admin_users table)
CREATE POLICY "Admins have full access to categories" ON categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admins have full access to items" ON items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admins have full access to item_images" ON item_images
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admins have full access to inquiries" ON inquiries
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admins can view admin_users" ON admin_users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Pokémon TCG', 'pokemon', 'Vintage cards, sealed product, and graded specimens from the world''s most valuable trading card game.', 1),
    ('Magic: The Gathering', 'mtg', 'Rare and collectible cards from the original trading card game. Power Nine, Reserved List, and more.', 2),
    ('Sports Cards', 'sports-cards', 'Graded rookies, vintage cards, and iconic moments from baseball, basketball, football, and hockey.', 3),
    ('Watches & Timepieces', 'watches', 'Rolex, Patek Philippe, Audemars Piguet, and other prestigious horological masterpieces.', 4),
    ('Fine Jewelry', 'jewelry', 'Exceptional pieces from renowned houses and estate collections of distinction.', 5),
    ('Designer Fashion', 'designer-fashion', 'Authenticated luxury from Hermès, Chanel, Louis Vuitton, and the world''s premier fashion houses.', 6),
    ('Supreme & Streetwear', 'supreme-streetwear', 'Rare collaborations, box logos, and sought-after pieces from Supreme, BAPE, and beyond.', 7),
    ('Coins & Numismatics', 'coins', 'Rare coins, currency, and precious metals with verified provenance.', 8);

-- Insert sample items (placeholders)
INSERT INTO items (title, description, category_id, condition, is_featured, display_order) VALUES
    ('1999 Pokémon Base Set Charizard Holo PSA 10', 'The holy grail of Pokémon collecting. Flawless gem mint condition with perfect centering and surfaces.', (SELECT id FROM categories WHERE slug = 'pokemon'), 'PSA 10 Gem Mint', true, 1),
    ('1st Edition Shadowless Blastoise PSA 9', 'Exceptional example of the iconic Water-type starter from the original 1999 release.', (SELECT id FROM categories WHERE slug = 'pokemon'), 'PSA 9 Mint', false, 2),
    ('Black Lotus (Beta) BGS 9', 'The most iconic card in Magic history. Beta printing with exceptional eye appeal.', (SELECT id FROM categories WHERE slug = 'mtg'), 'BGS 9 Mint', true, 1),
    ('Mox Sapphire (Unlimited) PSA 8', 'Part of the Power Nine. Beautiful blue gem in collector-grade condition.', (SELECT id FROM categories WHERE slug = 'mtg'), 'PSA 8 NM-MT', false, 2),
    ('2003 LeBron James Topps Chrome Refractor PSA 10', 'The King''s most sought-after rookie card in perfect gem mint condition.', (SELECT id FROM categories WHERE slug = 'sports-cards'), 'PSA 10 Gem Mint', true, 1),
    ('1986 Michael Jordan Fleer #57 PSA 9', 'The definitive Jordan rookie. Sharp corners and vibrant colors.', (SELECT id FROM categories WHERE slug = 'sports-cards'), 'PSA 9 Mint', false, 2),
    ('Rolex Daytona 116500LN Panda Dial', 'Unworn with box and papers. The most sought-after modern Rolex reference.', (SELECT id FROM categories WHERE slug = 'watches'), 'Unworn / Complete Set', true, 1),
    ('Patek Philippe Nautilus 5711/1A Blue Dial', 'Discontinued icon. Complete with box, papers, and service history.', (SELECT id FROM categories WHERE slug = 'watches'), 'Excellent / Complete Set', false, 2),
    ('Cartier Love Bracelet 18K Yellow Gold', 'Classic design in pristine condition. Size 17 with screwdriver and box.', (SELECT id FROM categories WHERE slug = 'jewelry'), 'Excellent', true, 1),
    ('Tiffany & Co. Victoria Diamond Necklace', '2.5 CTW of exceptional VS1 diamonds in platinum setting.', (SELECT id FROM categories WHERE slug = 'jewelry'), 'Like New', false, 2),
    ('Hermès Birkin 25 Black Togo GHW', 'The ultimate luxury handbag. Pristine condition with all accessories.', (SELECT id FROM categories WHERE slug = 'designer-fashion'), 'Pristine', true, 1),
    ('Chanel Classic Flap Medium Caviar Black', 'Timeless elegance. Light wear consistent with occasional use.', (SELECT id FROM categories WHERE slug = 'designer-fashion'), 'Excellent', false, 2),
    ('Supreme x Louis Vuitton Box Logo Hoodie Red', 'Deadstock from the legendary 2017 collaboration. Size Large.', (SELECT id FROM categories WHERE slug = 'supreme-streetwear'), 'Deadstock / New', true, 1),
    ('Supreme 20th Anniversary Box Logo Tee White', 'Rare anniversary edition. Unworn with original tags.', (SELECT id FROM categories WHERE slug = 'supreme-streetwear'), 'New with Tags', false, 2),
    ('1907 Saint-Gaudens Double Eagle High Relief PCGS MS65', 'Considered the most beautiful American coin ever minted.', (SELECT id FROM categories WHERE slug = 'coins'), 'PCGS MS65', true, 1),
    ('1909-S VDB Lincoln Cent PCGS MS64 RD', 'The key date Lincoln cent with full red designation.', (SELECT id FROM categories WHERE slug = 'coins'), 'PCGS MS64 RD', false, 2);

-- Storage bucket for images (run this separately in Supabase Dashboard > Storage)
-- Create a bucket called 'item-images' with public access
