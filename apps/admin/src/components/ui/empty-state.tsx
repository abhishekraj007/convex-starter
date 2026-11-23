import * as React from "react";

import { cn } from "@/lib/utils";

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="empty-state" className={cn("relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-border-strong px-6 py-12 text-center", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(50%_60%_at_50%_40%,black,transparent)]" />
      {icon ? (
        <div className="surface relative mb-3 flex size-11 items-center justify-center rounded-xl text-muted-foreground [&>svg]:size-5">{icon}</div>
      ) : null}
      <p className="relative text-[15px] font-semibold tracking-[-0.015em]">{title}</p>
      {description ? <p className="relative max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="relative mt-4">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
