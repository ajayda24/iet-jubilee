import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { CaptionFeed } from "@/components/caption-feed";
import { Caption } from "@/lib/types";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let captions: Caption[] = [];
  let userProfile: any | null = null;
  let captionCount: any | null = null;
  let dbError: string | null = null;
  let userLikedCaptions = new Set<string>();

  try {
    const { data, error } = await supabase
      .from("captions")
      .select("*")
      .order("like_count", { ascending: false })
      .order("created_at", { ascending: false });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    const { count } = await supabase
      .from("captions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user?.id);

    captionCount = count;

    if (!profileError) {
      userProfile = profile;
    }

    if (error) {
      if (
        error.code === "PGRST205" ||
        error.message?.includes("Could not find the table")
      ) {
        dbError =
          "Database tables not initialized. Please run the SQL migration.";
      } else {
        dbError = error.message || "Failed to load captions";
      }
    } else {
      captions = data || [];
    }

    if (user && !dbError) {
      const { data: likes } = await supabase
        .from("likes")
        .select("caption_id")
        .eq("user_id", user.id);

      if (likes) {
        userLikedCaptions = new Set(likes.map((like) => like.caption_id));
      }
    }
  } catch (error) {
    dbError = "Database connection error. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} profile={userProfile} captionCount={captionCount} />

      <main className="container px-4 py-8 mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground text-balance">
            Caption Ideas for Jubilee
          </h1>
          <p className="text-muted-foreground mt-3 text-lg text-pretty">
            Submit your creative caption ideas and vote for your favorites
          </p>
        </div>

        {dbError ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="font-semibold text-destructive mb-2">
                Database Setup Required
              </h2>
              <p className="text-sm text-foreground">{dbError}</p>
            </div>
            <div className="bg-background rounded p-4 mb-6 border border-border/50">
              <p className="text-xs text-muted-foreground font-mono mb-2">
                Step 1: Copy SQL script
              </p>
              <p className="text-sm text-foreground font-mono">
                File:{" "}
                <span className="text-primary font-bold">
                  /scripts/001_create_tables.sql
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-3 mb-3">
                Step 2: Paste in Supabase SQL Editor
              </p>
              <p className="text-xs text-muted-foreground">
                Step 3: Click "Run" and wait for success
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/setup" className="flex-1">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium transition-colors">
                  Setup Guide →
                </button>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-sm font-medium transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : null}

        <CaptionFeed
          captions={captions}
          userId={user?.id || null}
          userLikedCaptions={userLikedCaptions}
        />
      </main>
    </div>
  );
}
