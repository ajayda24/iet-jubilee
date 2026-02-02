"use client";

import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  initialLiked: boolean;
  initialCount: number;
  onLike: () => Promise<boolean>;
  onUnlike: () => Promise<boolean>;
}

export function LikeButton({
  initialLiked,
  initialCount,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = useCallback(async () => {
    if (isAnimating) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      setIsAnimating(true);
      setParticles([...Array(6)].map((_, i) => i));
      setTimeout(() => {
        setIsAnimating(false);
        setParticles([]);
      }, 700);
    }

    const success = newLiked ? await onLike() : await onUnlike();
    if (!success) {
      setLiked(!newLiked);
      setCount((prev) => (newLiked ? prev - 1 : prev + 1));
    }
  }, [liked, isAnimating, onLike, onUnlike]);

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={liked ? "Unlike" : "Like"}
    >
      <div className="relative">
        <Heart
          className={cn(
            "w-6 h-6 transition-all duration-300",
            liked
              ? "fill-rose-500 text-rose-500 scale-110"
              : "text-muted-foreground group-hover:text-rose-400"
          )}
          style={{
            filter: liked ? "drop-shadow(0 0 8px rgba(244, 63, 94, 0.5))" : "none",
          }}
        />

        {isAnimating && (
          <>
            <span className="absolute inset-0 animate-ping">
              <Heart className="w-6 h-6 text-rose-500 opacity-75" />
            </span>
            {particles.map((i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-rose-500"
                style={{
                  animation: `particle-${i} 0.6s ease-out forwards`,
                }}
              />
            ))}
          </>
        )}
      </div>

      <span
        className={cn(
          "text-sm font-medium tabular-nums transition-colors duration-200",
          liked ? "text-rose-500" : "text-muted-foreground"
        )}
      >
        {count}
      </span>

      <style jsx>{`
        @keyframes particle-0 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(12px, -18px) scale(0); opacity: 0; }
        }
        @keyframes particle-1 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-12px, -18px) scale(0); opacity: 0; }
        }
        @keyframes particle-2 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(18px, 0px) scale(0); opacity: 0; }
        }
        @keyframes particle-3 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-18px, 0px) scale(0); opacity: 0; }
        }
        @keyframes particle-4 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(12px, 14px) scale(0); opacity: 0; }
        }
        @keyframes particle-5 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-12px, 14px) scale(0); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
