import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl transition duration-200 shadow-input p-5 bg-night-deep/80 border border-gold/20 justify-between flex flex-col space-y-4 backdrop-blur-md",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="flex items-center gap-2 mb-2 text-gold">
          {icon}
          <div className="font-display font-bold text-lg text-cream tracking-wide">
            {title}
          </div>
        </div>
        <div className="font-sans font-normal text-cream/70 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};

