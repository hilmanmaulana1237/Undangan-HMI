"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Leaf {
  id: number;
  x: number;
  targetX: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const items: Leaf[] = Array.from({ length: 12 }, (_, i) => {
      const startX = Math.random() * 100;
      return {
        id: i,
        x: startX,
        targetX: startX + (Math.random() * 8 - 4),
        size: Math.random() * 10 + 8,
        duration: Math.random() * 10 + 12,
        delay: Math.random() * 6,
        rotation: Math.random() * 360,
      };
    });
    setLeaves(items);
  }, []);

  if (leaves.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{
            y: "-10vh",
            x: `${leaf.x}vw`,
            rotate: leaf.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${leaf.targetX}vw`,
            rotate: leaf.rotation + 360,
            opacity: [0, 0.5, 0.7, 0.3, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <svg
            width={leaf.size}
            height={leaf.size * 1.5}
            viewBox="0 0 24 36"
            fill="none"
            className="text-emerald-500/25 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
          >
            <path
              d="M12 0 C2 12, 0 24, 12 36 C24 24, 22 12, 12 0 Z"
              fill="currentColor"
            />
            <path
              d="M12 4 L12 32"
              stroke="rgba(212,175,55,0.4)"
              strokeWidth="0.8"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
