"use client";

import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@convex-starter/backend/convex/_generated/api";
import { getClientPaymentProvider } from "@/lib/payment-provider";
import { toast } from "sonner";

export function usePaymentPortal() {
  const provider = getClientPaymentProvider();
  const router = useRouter();
  const getCustomerPortal = useAction(
    api.features.payments.actions.getCustomerPortal,
  );

  const openPortal = async (customerId?: string | null) => {
    if (provider === "dodo") {
      try {
        const { portal_url } = await getCustomerPortal({ sendEmail: false });
        window.location.assign(portal_url);
      } catch (error) {
        console.error("Failed to open Dodo customer portal:", error);
        toast.error("Failed to open customer portal. Please try again.");
      }
      return;
    }

    if (!customerId) {
      console.error("No customer ID found");
      toast.error("No billing customer found for this account.");
      return;
    }

    router.push(`/portal?userId=${customerId}` as never);
  };

  return { openPortal };
}
