"use client";

import { Caption } from "@/lib/types";
import { CaptionCard } from "./caption-card";
import { MessageSquare } from "lucide-react";

interface CaptionFeedProps {
  captions: Caption[];
  userId: string | null;
  userLikedCaptions: Set<string>;
}

export function CaptionFeed({
  captions,
  userId,
  userLikedCaptions,
}: CaptionFeedProps) {
  if (captions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No captions yet
        </h3>
        <p className="text-muted-foreground mt-1">
          Be the first to submit a caption idea!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {captions.map((caption) => (
        <CaptionCard
          key={caption.id}
          caption={caption}
          userId={userId}
          userLikedCaptions={userLikedCaptions}
        />
      ))}
    </div>
  );
}
