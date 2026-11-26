"use client";

import { api } from "@convex-starter/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Smartphone, Upload, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { PageShell } from "@/components/admin/page-shell";
import { StatCard } from "@/components/admin/stat-card";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const userData = useQuery(api.user.fetchUserAndProfile);
  const uploads = useQuery(api.uploads.listUserUploads, { limit: 50 });
  const audienceStats = useQuery(
    api.pushNotifications.adminGetPushAudienceStats,
    userData?.profile?.isAdmin ? {} : "skip",
  );

  const stats = [
    { label: "Uploads", value: uploads?.length ?? 0, caption: "Files stored in this workspace", icon: Upload },
    { label: "Push audience", value: audienceStats?.eligibleUsers ?? 0, caption: "Users eligible for notifications", icon: Users },
    { label: "Registered devices", value: audienceStats?.registeredUsers ?? 0, caption: "Devices receiving push", icon: Smartphone },
  ];

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader
          title="Dashboard"
          subtitle="Overview of reusable account, upload, notification, and runtime configuration tools."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {userData === undefined ? (
          <Skeleton className="mt-4 h-40 w-full rounded-3xl" />
        ) : (
          <Card className="mt-4 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg">
                Welcome back,{" "}
                {userData?.profile?.name || userData?.userMetadata?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Use this admin console to manage shared app settings, uploads,
                push notifications, account access, and billing primitives.
              </p>
            </CardContent>
          </Card>
        )}
      </PageShell>
    </ProtectedRoute>
  );
}
