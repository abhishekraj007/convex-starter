"use client";

import { AlertTriangle, Mail, Send, UserRound, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { PageShell } from "@/components/admin/page-shell";
import { StatChip } from "@/components/admin/stat-chip";
import { EmptyState } from "@/components/admin/empty-state";
import { ProtectedRoute } from "@/components/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  EMAIL_TARGET_MODE,
  useAdminEmails,
  type EmailTargetMode,
} from "@/hooks/use-admin-emails";

export default function EmailsPage() {
  const state = useAdminEmails();

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader
          title="Emails"
          subtitle="Send a transactional email to one registered user or broadcast to all users. Delivered through Cloudflare Email Sending."
          actions={
            <Button onClick={state.handleSend} disabled={!state.canSend}>
              {state.isSending ? (
                <Spinner className="size-4" />
              ) : (
                <Send className="size-4" />
              )}
              {state.isSending
                ? "Sending..."
                : state.targetMode === EMAIL_TARGET_MODE.bulk
                  ? "Send Bulk Email"
                  : "Send Email"}
            </Button>
          }
        />

        {state.isGateLoading ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : !state.canManageEmails ? (
          <EmptyState
            icon={<Mail className="size-6" />}
            title="Admin access required"
            description="Only admins can send emails to users."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Compose Email</CardTitle>
                <CardDescription>
                  Choose whether to target one registered user or broadcast to
                  every registered user.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email-target-mode">Audience</Label>
                  <Select
                    value={state.targetMode}
                    onValueChange={(value) =>
                      state.setTargetMode(value as EmailTargetMode)
                    }
                  >
                    <SelectTrigger id="email-target-mode" className="w-full">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EMAIL_TARGET_MODE.single}>
                        Single user
                      </SelectItem>
                      <SelectItem value={EMAIL_TARGET_MODE.bulk}>
                        All registered users
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {state.targetMode === EMAIL_TARGET_MODE.single ? (
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="recipient-email"
                        type="email"
                        placeholder="user@example.com"
                        className="pl-9"
                        value={state.email}
                        onChange={(event) =>
                          state.setEmail(event.target.value)
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The recipient must be a registered user. To test, send
                      the email to your own account address.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex flex-wrap gap-2">
                      <StatChip
                        label="registered users"
                        value={state.audienceStats?.totalUsers ?? 0}
                        variant="default"
                      />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Bulk sends email every registered user. Use with care —
                      there is no undo.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={state.subject}
                    onChange={(event) => state.setSubject(event.target.value)}
                    placeholder="Email subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-body">Body</Label>
                  <Textarea
                    id="email-body"
                    rows={8}
                    value={state.body}
                    onChange={(event) => state.setBody(event.target.value)}
                    placeholder="Plain text body. Paragraphs are preserved in the HTML version."
                  />
                  <p className="text-xs text-muted-foreground">
                    Plain text only — the HTML version is generated
                    automatically with the app email template.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {state.targetMode === EMAIL_TARGET_MODE.single
                    ? "Recipient Status"
                    : "Delivery"}
                </CardTitle>
                <CardDescription>
                  {state.targetMode === EMAIL_TARGET_MODE.single
                    ? "The send button is enabled only when the email belongs to a registered user."
                    : "Review delivery configuration before broadcasting."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!state.emailConfigured ? (
                  <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-text" />
                    <div>
                      <p className="text-sm font-medium text-warning-text">
                        Cloudflare email is not configured
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_EMAIL_API_TOKEN,
                        and AUTH_EMAIL_FROM on the Convex deployment.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <StatChip label="cloudflare email" value="ready" variant="default" />
                  </div>
                )}

                {state.targetMode === EMAIL_TARGET_MODE.single ? (
                  state.email.trim() === "" ? (
                    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                      <UserRound className="size-4" />
                      Enter a recipient email to look up the user.
                    </div>
                  ) : state.targetUser === undefined ? (
                    <Skeleton className="h-16 w-full" />
                  ) : state.targetUser === null ? (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <p className="text-sm font-medium">No user found</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        No registered profile matches this email address.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">registered</Badge>
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        {state.targetUser.name || "Unnamed user"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {state.targetUser.email}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users className="size-4" />
                      {state.audienceStats?.totalUsers ?? 0} registered user(s)
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Each user receives the same subject and body. Sends are
                      rate-limited per recipient by Cloudflare.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </PageShell>
    </ProtectedRoute>
  );
}
