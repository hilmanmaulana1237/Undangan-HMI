"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link?: string;
    icon?: React.ReactNode;
    badge?: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title + idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-emerald-800/30 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="rounded-2xl h-full w-full p-5 overflow-hidden bg-night-deep/90 border border-gold/25 relative z-20 backdrop-blur-md transition-colors group-hover:border-gold/60">
            <div className="relative z-50">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20">
                  {item.icon}
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-emerald-950 border border-gold/30 text-gold-soft">
                    {item.badge}
                  </span>
                )}
              </div>
              <h4 className="text-cream font-display font-bold text-lg tracking-wide mb-2">
                {item.title}
              </h4>
              <p className="text-cream/70 text-xs leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

