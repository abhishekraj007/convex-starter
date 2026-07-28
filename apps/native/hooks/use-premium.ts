import { useQuery } from "convex/react";
import { api } from "@convex-starter/backend";

export const usePremium = () => {
  const status = useQuery(api.features.premium.queries.isPremium, {});

  return {
    isPremium: status?.isPremium ?? false,
    isLoading: status === undefined,
    grantedBy: status?.grantedBy,
  };
};
