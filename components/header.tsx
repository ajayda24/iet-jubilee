"use client";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { CaptionSubmitForm } from "./caption-submit-form";

interface HeaderProps {
  user: User | null;
  profile: any | null;
  captionCount: any | null;
}

export function Header({ user, profile, captionCount }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Jubilee Captions</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <CaptionSubmitForm
                userId={user.id}
                userEmail={user.email}
                profile={profile}
                captionCount={captionCount}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth/login">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
