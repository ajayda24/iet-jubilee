-- Captions table: stores all caption submissions
CREATE TABLE IF NOT EXISTS public.captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  department TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes table: tracks which user liked which caption (prevents duplicates)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_id UUID NOT NULL REFERENCES public.captions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(caption_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Captions policies
-- Anyone can view captions
CREATE POLICY IF NOT EXISTS "captions_select_all" ON public.captions FOR SELECT USING (true);

-- Authenticated users can insert captions
CREATE POLICY IF NOT EXISTS "captions_insert_auth" ON public.captions FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own captions
CREATE POLICY IF NOT EXISTS "captions_update_own" ON public.captions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own captions
CREATE POLICY IF NOT EXISTS "captions_delete_own" ON public.captions FOR DELETE 
  USING (auth.uid() = user_id);

-- Likes policies
-- Anyone can view likes
CREATE POLICY IF NOT EXISTS "likes_select_all" ON public.likes FOR SELECT USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY IF NOT EXISTS "likes_insert_own" ON public.likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY IF NOT EXISTS "likes_delete_own" ON public.likes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_captions_like_count ON public.captions(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_captions_created_at ON public.captions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_caption_id ON public.likes(caption_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);

-- Function to increment like count
CREATE OR REPLACE FUNCTION public.increment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.captions SET like_count = like_count + 1 WHERE id = NEW.caption_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement like count
CREATE OR REPLACE FUNCTION public.decrement_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.captions SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.caption_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-increment like count on insert
DROP TRIGGER IF EXISTS trigger_increment_like ON public.likes;
CREATE TRIGGER trigger_increment_like
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_like_count();

-- Trigger to auto-decrement like count on delete
DROP TRIGGER IF EXISTS trigger_decrement_like ON public.likes;
CREATE TRIGGER trigger_decrement_like
  AFTER DELETE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_like_count();
