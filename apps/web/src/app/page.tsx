import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Shield,
  Code,
  Rocket,
  Check,
  ArrowRight,
  Star,
  Smartphone,
  Globe,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convex SaaS Starter - Ship Your SaaS Faster",
  description:
    "The complete SaaS starter kit with Next.js, Expo React Native, Convex, Better Auth, Polar payments, and RevenueCat. Launch your cross-platform SaaS in days.",
};

const features = [
  {
    icon: Globe,
    title: "Web & Mobile",
    description:
      "One codebase, two platforms. Build for web with Next.js and native mobile apps with Expo React Native.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with Next.js and Convex for optimal performance and real-time data synchronization.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Enterprise-grade authentication with Better Auth and secure payment processing via Polar.",
  },
  {
    icon: Smartphone,
    title: "Native Mobile",
    description:
      "iOS and Android apps with Expo, RevenueCat for in-app purchases, and shared backend logic.",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description:
      "TypeScript-first with shadcn/ui for web and NativeWind for mobile, ready to customize.",
  },
  {
    icon: Rocket,
    title: "Production Ready",
    description:
      "Complete subscription management, credit system, and payment webhooks out of the box.",
  },
];

const benefits = [
  "Full-stack TypeScript with Next.js",
  "Native mobile apps with Expo & React Native",
  "Real-time database with Convex",
  "Authentication with Better Auth",
  "Web payments with Polar",
  "Mobile payments with RevenueCat",
  "Credit/token system included",
  "Shared backend logic across platforms",
  "NativeWind styling for mobile",
  "Responsive web design with shadcn/ui",
  "Dark mode support everywhere",
  "SEO optimized web pages",
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Convex SaaS Starter",
    description:
      "The complete cross-platform SaaS starter kit with authentication, payments, subscriptions, AI, and more.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">
              Launch your SaaS in days, not months
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            The Complete SaaS Starter Kit
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Everything you need to build and launch your next SaaS product.
            Authentication, payments, subscriptions, and more -- all
            pre-configured and ready to deploy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" asChild>
              <Link href="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies and best practices to help you ship
            faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/60 bg-card/50 hover:bg-card transition-colors"
            >
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Cross-Platform Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-medium">Cross-Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Backend, Multiple Platforms
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Build your web app with Next.js and native mobile apps with Expo,
              all powered by the same Convex backend. Share business logic,
              authentication, and data across all platforms seamlessly.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Web with Next.js</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Server-side rendering, API routes, and shadcn/ui components
                    for a beautiful web experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Mobile with Expo</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Native iOS and Android apps using React Native, Expo Router,
                    and NativeWind for styling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 p-8">
            <h3 className="font-semibold text-xl mb-6">Tech Stack</h3>
            <div className="space-y-5">
              {[
                {
                  label: "Web",
                  techs: [
                    "Next.js",
                    "shadcn/ui",
                    "Tailwind CSS",
                    "Polar Payments",
                  ],
                },
                {
                  label: "Mobile",
                  techs: ["Expo", "React Native", "NativeWind", "RevenueCat"],
                },
                {
                  label: "Backend",
                  techs: [
                    "Convex",
                    "Better Auth",
                    "TypeScript",
                    "Real-time Sync",
                  ],
                },
              ].map((group) => (
                <div key={group.label}>
                  <h4 className="font-medium text-sm mb-2 text-primary">
                    {group.label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.techs.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Modern SaaS
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Skip the boilerplate and focus on building your unique features.
              Our starter kit includes everything you need to launch a
              production-ready SaaS application.
            </p>
            <Button asChild>
              <Link href="/dashboard">
                Explore Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 py-1">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your SaaS?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join developers who are shipping faster with our production-ready
            starter kit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth">
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">Read the Docs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SaaS Starter. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
