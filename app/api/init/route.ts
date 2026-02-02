import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Check if captions table exists by trying to query it
    const { error: checkError } = await supabase
      .from('captions')
      .select('count')
      .limit(0);

    if (checkError?.code === 'PGRST205') {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS public.captions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            caption_text TEXT NOT NULL,
            author_name TEXT NOT NULL,
            department TEXT NOT NULL,
            like_count INTEGER DEFAULT 0,
            user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS public.likes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            caption_id UUID NOT NULL REFERENCES public.captions(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(caption_id, user_id)
          );

          ALTER TABLE public.captions ENABLE ROW LEVEL SECURITY;
          ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

          CREATE POLICY IF NOT EXISTS "captions_select_all" ON public.captions FOR SELECT USING (true);
          CREATE POLICY IF NOT EXISTS "captions_insert_auth" ON public.captions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
          CREATE POLICY IF NOT EXISTS "captions_update_own" ON public.captions FOR UPDATE USING (auth.uid() = user_id);
          CREATE POLICY IF NOT EXISTS "captions_delete_own" ON public.captions FOR DELETE USING (auth.uid() = user_id);

          CREATE POLICY IF NOT EXISTS "likes_select_all" ON public.likes FOR SELECT USING (true);
          CREATE POLICY IF NOT EXISTS "likes_insert_own" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
          CREATE POLICY IF NOT EXISTS "likes_delete_own" ON public.likes FOR DELETE USING (auth.uid() = user_id);

          CREATE INDEX IF NOT EXISTS idx_captions_like_count ON public.captions(like_count DESC);
          CREATE INDEX IF NOT EXISTS idx_captions_created_at ON public.captions(created_at DESC);
          CREATE INDEX IF NOT EXISTS idx_likes_caption_id ON public.likes(caption_id);
          CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
        `
      });

      if (createError) {
        return Response.json({ error: createError.message }, { status: 500 });
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
