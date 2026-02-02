import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react";

const SQL_CONTENT = `-- Captions table
CREATE TABLE IF NOT EXISTS public.captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  department TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_id UUID NOT NULL REFERENCES public.captions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(caption_id, user_id)
);

-- Enable RLS
ALTER TABLE public.captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Policies and more...`;

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-2xl py-16 px-4 mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">
            Database Setup
          </h1>
          <p className="text-muted-foreground text-lg">
            Get your Jubilee Captions app ready in one minute
          </p>
        </div>

        <div className="grid gap-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </span>
                    Go to Supabase Dashboard
                  </CardTitle>
                  <CardDescription>
                    Open your Supabase project
                  </CardDescription>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>• Visit supabase.com</li>
                <li>• Sign in to your project</li>
                <li>• Scroll to "SQL Editor"</li>
              </ol>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </span>
                Create New Query
              </CardTitle>
              <CardDescription>
                In SQL Editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Click the "+ New Query" button
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </span>
                Copy and Paste SQL
              </CardTitle>
              <CardDescription>
                Run the migration script
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Copy the contents of <code className="bg-background px-2 py-1 rounded text-foreground">/scripts/001_create_tables.sql</code> from your project and paste it here.
                </p>
                <div className="bg-background rounded-lg p-4 border max-h-64 overflow-y-auto">
                  <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                    {SQL_CONTENT.substring(0, 500)}...
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  (Showing first 500 chars - full script in your project)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  4
                </span>
                Click "Run"
              </CardTitle>
              <CardDescription>
                Execute the SQL query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click the blue "Run" button to create tables, policies, and triggers.
              </p>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  5
                </span>
                Return to App
              </CardTitle>
              <CardDescription>
                Go back and refresh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Come back to your app and refresh the page. You should see the caption feed!
              </p>
              <Button asChild className="w-full">
                <Link href="/">← Go Back to App</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                Still Getting "Table Not Found"?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-1">Check the SQL ran without errors</p>
                  <p className="text-muted-foreground">Look for the green checkmark and "Query successful"</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Verify tables exist</p>
                  <p className="text-muted-foreground">In SQL Editor, run: <code className="bg-background px-2 py-0.5 rounded">SELECT * FROM public.captions LIMIT 1;</code></p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Clear your browser cache</p>
                  <p className="text-muted-foreground">Hard refresh with Ctrl+Shift+R or Cmd+Shift+R</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          <Card className="border-emerald-500/50 bg-emerald-500/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                After setup completes successfully, you can:
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Sign in with magic link</li>
                <li>✓ Submit captions</li>
                <li>✓ Like and vote on captions</li>
                <li>✓ See votes update instantly</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need the full SQL? Check your project at <code className="bg-background px-2 py-1 rounded">/scripts/001_create_tables.sql</code>
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              ← Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
