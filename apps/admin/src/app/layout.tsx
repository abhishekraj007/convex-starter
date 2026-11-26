import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "../index.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Providers from "@/components/providers";
import { LayoutContent } from "@/components/layout-content";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

// Plus Jakarta Sans everywhere: warm geometric letterforms and heavy numerals; Geist Mono for code and IDs.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convex Starter - Admin",
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
      className={cn(jakarta.variable, geistMono.variable)}
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
