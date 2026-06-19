import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { useCallback, type ReactNode } from "react";
import { authClient } from "@/lib/betterAuth/client";

if (!process.env.EXPO_PUBLIC_CONVEX_URL) {
  throw new Error("EXPO_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
  verbose: false,
});

export default function ConvexProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useBetterAuthForConvex}>
      <ConvexQueryCacheProvider expiration={300000} maxIdleEntries={100}>
        {children}
      </ConvexQueryCacheProvider>
    </ConvexProviderWithAuth>
  );
}

function useBetterAuthForConvex() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const sessionId = session?.session?.id;

  const fetchAccessToken = useCallback(async () => {
    try {
      const { data } = await authClient.convex.token();
      return data?.token ?? null;
    } catch {
      return null;
    }
  }, [sessionId]);

  return {
    isLoading: isSessionPending,
    isAuthenticated: session !== null,
    fetchAccessToken,
  };
}
