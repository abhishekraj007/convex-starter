import { useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const requireAuth = () => {
    if (isLoading) {
      return false;
    }

    if (!isAuthenticated) {
      router.push("/(root)/(auth)" as never);
      return false;
    }

    return true;
  };

  return { isAuthenticated, isLoading, requireAuth };
};
