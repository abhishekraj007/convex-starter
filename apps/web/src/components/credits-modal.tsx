"use client";

import { useQuery as useConvexQuery } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles, Zap } from "lucide-react";
import { getCatalogCreditAmount } from "@/lib/billing-catalog";
import { useCreditProductsQuery } from "@/hooks/use-payment-catalog";
import { usePaymentCheckout } from "@/hooks/use-payment-checkout";

interface CreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditsModal({ open, onOpenChange }: CreditsModalProps) {
  const userData = useConvexQuery(api.user.fetchUserAndProfile);
  const { data: catalogProducts = [], isLoading } = useCreditProductsQuery(open);
  const { openCheckout, loadingProductId } = usePaymentCheckout();

  const handleCheckout = (productId: string | undefined) => {
    if (!productId) {
      console.error("No product ID provided");
      return;
    }

    const userId = userData?.profile?.authUserId || "";
    const userEmail = userData?.userMetadata.email || "";
    const userName = userData?.profile?.name || userData?.userMetadata.name;

    void openCheckout({
      productId,
      customerExternalId: userId,
      customerEmail: userEmail,
      customerName: userName,
    });
  };

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Coins className="h-8 w-8 text-foreground" />;
      case 1:
        return <Sparkles className="h-8 w-8 text-foreground" />;
      case 2:
        return <Zap className="h-8 w-8 text-foreground" />;
      default:
        return <Coins className="h-8 w-8 text-foreground" />;
    }
  };

  const getBadge = (credits: number) => {
    if (credits === 2500) return "Popular";
    return undefined;
  };

  const creditProducts = catalogProducts
    .map((product) => {
      const credits = getCatalogCreditAmount(product);
      return {
        product,
        credits,
        badge: getBadge(credits),
      };
    })
    .sort((a, b) => a.credits - b.credits);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Buy Credits</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading options...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {creditProducts.map((item, index: number) => {
              const price = item.product.prices[0]?.priceAmount
                ? (item.product.prices[0].priceAmount / 100).toFixed(2)
                : "0.00";

              return (
                <Card
                  key={item.product.id}
                  className={
                    item.badge === "Popular"
                      ? "border-primary shadow-lg relative"
                      : "relative"
                  }
                >
                  {item.badge ? (
                    <div className="absolute top-[-16px] left-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          item.badge === "Popular"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  ) : null}
                  <CardHeader>
                    <div className="flex flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">{getIcon(index)}</div>
                        <div className="flex flex-col">
                          <span className="text-lg">{item.product.name}</span>
                          <span className="text-xl font-bold">${price}</span>
                        </div>
                      </div>
                      <div>
                        {item.product.id ? (
                          <Button
                            className="w-full"
                            onClick={() => handleCheckout(item.product.id)}
                            disabled={loadingProductId === item.product.id}
                          >
                            {loadingProductId === item.product.id
                              ? "Processing..."
                              : "Buy Now"}
                          </Button>
                        ) : (
                          <Button className="w-full" disabled>
                            Unavailable
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
