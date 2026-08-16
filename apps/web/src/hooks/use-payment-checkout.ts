"use client";

import { useAction } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import { getClientPaymentProvider } from "@/lib/payment-provider";
import { usePolarEmbedCheckout } from "@/hooks/use-polar-embed-checkout";
import { toast } from "sonner";
import { useState } from "react";

type CheckoutOptions = {
  productId: string;
  customerExternalId: string;
  customerEmail?: string | null;
  customerName?: string | null;
};

export function usePaymentCheckout() {
  const provider = getClientPaymentProvider();
  const polarCheckout = usePolarEmbedCheckout();
  const createDodoCheckout = useAction(
    api.features.payments.actions.createCheckout,
  );
  const [dodoLoadingProductId, setDodoLoadingProductId] = useState<
    string | null
  >(null);

  const openCheckout = async (options: CheckoutOptions) => {
    if (provider === "dodo") {
      setDodoLoadingProductId(options.productId);
      try {
        const returnUrl = `${window.location.origin}/success`;
        const { checkout_url } = await createDodoCheckout({
          productId: options.productId,
          returnUrl,
        });
        window.location.assign(checkout_url);
      } catch (error) {
        setDodoLoadingProductId(null);
        console.error("Failed to open Dodo checkout:", error);
        toast.error("Failed to open checkout. Please try again.");
      }
      return;
    }

    await polarCheckout.openCheckout(options);
  };

  return {
    openCheckout,
    preloadCheckout: polarCheckout.preloadCheckout,
    loadingProductId:
      provider === "dodo"
        ? dodoLoadingProductId
        : polarCheckout.loadingProductId,
  };
}
