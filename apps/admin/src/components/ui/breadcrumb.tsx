import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={className} {...props} />;
}
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground", className)} {...props} />;
}
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}
function BreadcrumbLink({ className, ...props }: React.ComponentProps<"a">) {
  return <a data-slot="breadcrumb-link" className={cn("transition-colors hover:text-foreground", className)} {...props} />;
}
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-current="page" data-slot="breadcrumb-page" className={cn("font-medium text-foreground", className)} {...props} />;
}
function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden="true" data-slot="breadcrumb-separator" className={cn("text-faint-foreground [&>svg]:size-3.5", className)} {...props}>
      <ChevronRight />
    </li>
  );
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator };
