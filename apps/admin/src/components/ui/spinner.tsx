import * as React from "react";

import { cn } from "@/lib/utils";

/** 8-bar spinner (Vercel/Geist style) that inherits currentColor. */
function Spinner({ className, size = 16, ...props }: React.ComponentProps<"span"> & { size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn("relative inline-block shrink-0 text-muted-foreground", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-[42%] left-[46%] h-[16%] w-[8%] animate-[spinner-fade_0.8s_linear_infinite] rounded-full bg-current"
          style={{ transform: `rotate(${i * 45}deg) translateY(-140%)`, transformOrigin: "50% 50%", animationDelay: `${-0.8 + i * 0.1}s`, left: "46%" }}
        />
      ))}
    </span>
  );
}

export { Spinner };
