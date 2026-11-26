"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { locales, localeNames, type Locale } from "@convex-starter/i18n";
import { setLocale } from "@/i18n/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      await setLocale(value as Locale);
      window.location.reload();
    });
  }

  return (
    <Select value={locale} onValueChange={(value) => value && handleChange(value)} disabled={isPending}>
      <SelectTrigger
        aria-label="Language"
        className={cn(
          "h-8 w-auto min-w-0 gap-1.5 px-2.5 text-[13px]",
          compact && "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground dark:bg-transparent"
        )}
      >
        <Globe className="size-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
