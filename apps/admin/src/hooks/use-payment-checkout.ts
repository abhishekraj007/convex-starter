"use client";

import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import { getClientPaymentProvider } from "@/lib/payment-provider";
import { toast } from "sonner";

type CheckoutOptions = {
  productId: string;
  customerExternalId: string;
  customerEmail?: string | null;
  customerName?: string | null;
};

export function usePaymentCheckout() {
  const provider = getClientPaymentProvider();
  const router = useRouter();
  const createDodoCheckout = useAction(
    api.features.payments.actions.createCheckout,
  );
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const openCheckout = async (options: CheckoutOptions) => {
    if (provider === "dodo") {
      setLoadingProductId(options.productId);
      try {
        const returnUrl = `${window.location.origin}/success`;
        const { checkout_url } = await createDodoCheckout({
          productId: options.productId,
          returnUrl,
        });
        window.location.assign(checkout_url);
      } catch (error) {
        setLoadingProductId(null);
        console.error("Failed to open Dodo checkout:", error);
        toast.error("Failed to open checkout. Please try again.");
      }
      return;
    }

    setLoadingProductId(options.productId);
    const params = new URLSearchParams({
      products: options.productId,
      customerExternalId: options.customerExternalId,
    });
    if (options.customerEmail) {
      params.set("customerEmail", options.customerEmail);
    }
    if (options.customerName) {
      params.set("customerName", options.customerName);
    }
    router.push(`/checkout?${params.toString()}` as never);
  };

  return {
    openCheckout,
    preloadCheckout: () => undefined,
    loadingProductId,
  };
}
