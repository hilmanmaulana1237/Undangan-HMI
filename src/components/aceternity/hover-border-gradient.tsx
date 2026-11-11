"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  onClick,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    onClick?: () => void;
  } & React.HTMLAttributes<HTMLElement>
>) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "relative group p-[2px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center",
        containerClassName
      )}
      {...props}
    >
      {/* Animated rotating conical beam border */}
      <span
        className="absolute inset-[-150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#d4af37_50%,transparent_100%)] opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden="true"
      />
      {/* Inner button container */}
      <span
        className={cn(
          "relative z-10 w-full h-full rounded-[14px] bg-gradient-to-r from-emerald-950 via-night-deep to-emerald-950 px-6 py-3 font-semibold text-xs tracking-wider text-cream flex items-center justify-center gap-2 border border-gold/30 shadow-xl group-hover:border-gold/60 transition-colors",
          className
        )}
      >
        {children}
      </span>
    </Tag>
  );
}
