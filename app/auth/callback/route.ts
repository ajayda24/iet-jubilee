import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    const errorMessage = errorDescription || error;
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent(errorMessage)}`,
        request.url,
      ),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/auth/error?message=No authorization code provided",
        request.url,
      ),
    );
  }

  try {
    const supabase = await createClient();

    // Exchange code for session
    const { error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      return NextResponse.redirect(
        new URL(
          `/auth/error?message=${encodeURIComponent(sessionError.message)}`,
          request.url,
        ),
      );
    }

    // Redirect to home page on success
    return NextResponse.redirect(new URL("/", request.url));
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent(message)}`,
        request.url,
      ),
    );
  }
}
