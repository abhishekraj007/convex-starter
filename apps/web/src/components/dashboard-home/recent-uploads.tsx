"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileIcon, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatBytes, formatShortDate } from "@/lib/format";

export type RecentUpload = {
  _id: string;
  key: string;
  contentType: string;
  contentLength: number;
  uploadedAt: number;
  url: string | null;
};

function UploadRow({ upload }: { upload: RecentUpload }) {
  const isImage = upload.contentType.startsWith("image/");
  const fileName = upload.key.split("/").pop() || "Untitled upload";
  const openProps = upload.url
    ? { href: upload.url, target: "_blank", rel: "noreferrer" }
    : { href: "/uploads" };

  return (
    <a
      {...openProps}
      className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-accent"
    >
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-faint-foreground ring-1 ring-border/60">
        {isImage && upload.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={upload.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        ) : isImage ? (
          <ImageIcon className="size-4" />
        ) : (
          <FileIcon className="size-4" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold">{fileName}</span>
        <span className="block text-[11px] text-muted-foreground">
          {formatBytes(upload.contentLength)} · {formatShortDate(upload.uploadedAt)}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-faint-foreground transition-colors group-hover:text-foreground" />
    </a>
  );
}

export function RecentUploads({ uploads, uploadCount, isLoading }: { uploads: RecentUpload[]; uploadCount: number; isLoading: boolean }) {
  return (
    <section className="surface flex flex-col rounded-3xl p-5 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.025em]">Recent uploads</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Images saved to your workspace.</p>
        </div>
        <Button variant="ghost" size="sm" shape="pill" render={<Link href="/uploads" />} className="gap-1.5">
          View all <ArrowRight />
        </Button>
      </header>

      {isLoading ? (
        <div className="mt-4 grid gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      ) : uploads.length === 0 ? (
        <EmptyState
          icon={<ImageIcon />}
          title="No uploads yet"
          description="Images you add to your workspace will show up here."
          action={
            <Button size="sm" shape="pill" render={<Link href="/uploads" />}>
              Upload an image
            </Button>
          }
          className={cn("mt-4 border-border/70 py-8")}
        />
      ) : (
        <ul className="mt-4 grid gap-1">
          {uploads.map((upload) => (
            <li key={upload._id}>
              <UploadRow upload={upload} />
            </li>
          ))}
        </ul>
      )}

      {isLoading || uploads.length === 0 ? null : (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-[10.5px] text-muted-foreground">
          <span>Showing {uploads.length} of {uploadCount} files</span>
          <span>Stored in Cloudflare R2</span>
        </div>
      )}
    </section>
  );
}
