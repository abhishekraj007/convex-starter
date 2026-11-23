import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "../index.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Providers from "@/components/providers";
import { LayoutContent } from "@/components/layout-content";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

// Inter for all UI text (dense tables/forms read best with it); Geist Mono only for code and IDs.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convex Starter",
  description: "Reusable Convex Starter admin console",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, geistMono.variable)}
    >
      <body className="font-sans antialiased">
        <Providers>
          <TooltipProvider>
            <LayoutContent>{children}</LayoutContent>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
