/*
  # Create Blog System

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `title` (text) - Blog post title
      - `slug` (text, unique) - URL-friendly version of title (e.g., "my-first-post")
      - `content` (text) - Full blog post content in markdown or HTML
      - `excerpt` (text) - Short description/summary of the post
      - `author_name` (text) - Author's name
      - `author_email` (text) - Author's email
      - `published` (boolean) - Whether the post is published or draft
      - `featured_image` (text) - URL to featured image (optional)
      - `tags` (text[]) - Array of tags for categorization
      - `views` (integer) - Number of views
      - `created_at` (timestamptz) - When post was created
      - `updated_at` (timestamptz) - When post was last updated
      - `published_at` (timestamptz) - When post was published
  
  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for anyone to read published posts (public)
    - Add policy for authenticated users to create posts
    - Add policy for post authors to update their own posts
    - Add policy for post authors to delete their own posts
  
  3. Indexes
    - Index on `slug` for fast lookups
    - Index on `published` and `published_at` for listing published posts
    - Index on `tags` for filtering by tags
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  published boolean DEFAULT false,
  featured_image text,
  tags text[] DEFAULT '{}',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'email' = author_email);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' = author_email)
  WITH CHECK (auth.jwt()->>'email' = author_email);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete own posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'email' = author_email);

-- Authors can view their own unpublished posts
CREATE POLICY "Authors can view own unpublished posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' = author_email);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();