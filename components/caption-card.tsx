"use client";

import { Caption, DEPARTMENTS } from "@/lib/types";
import { LikeButton } from "./like-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { User } from "lucide-react";

interface CaptionCardProps {
  caption: Caption;
  userId: string | null;
  userLikedCaptions: Set<string>;
}

export function CaptionCard({
  caption,
  userId,
  userLikedCaptions,
}: CaptionCardProps) {
  const isLiked = userLikedCaptions.has(caption.id);
  const departmentLabel =
    DEPARTMENTS.find((d) => d.value === caption.department)?.label ||
    caption.department;

  const handleLike = async () => {
    if (!userId) return false;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("likes").insert({
        caption_id: caption.id,
        user_id: userId,
      });
      if (error) return false;
      return true;
    } catch {
      return false;
    }
  };

  const handleUnlike = async () => {
    if (!userId) return false;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("caption_id", caption.id)
        .eq("user_id", userId);
      if (error) return false;
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <p className="text-lg leading-relaxed text-foreground text-pretty">
            "{caption.caption_text}"
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {caption.author_name}
                </span>
                <Badge variant="secondary" className="w-fit text-xs mt-0.5">
                  {departmentLabel}
                </Badge>
              </div>
            </div>

            <LikeButton
              initialLiked={isLiked}
              initialCount={caption.like_count}
              onLike={handleLike}
              onUnlike={handleUnlike}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
