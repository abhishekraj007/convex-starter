"use client";

import * as React from "react";
import { toast } from "@ui-sdk/react/toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible";
import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@ui-sdk/react/meter";
import {
  ArrowUpRight,
  Bell,
  ChevronsUpDown,
  CreditCard,
  FolderOpen,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Share2,
  Trash2,
  User,
} from "lucide-react";

import { DocSection, Demo, StateCell } from "./doc-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const rows = [
  { name: "convex-starter-web", env: "Production", status: "Ready", region: "bom1", updated: "2m ago" },
  { name: "convex-starter-admin", env: "Production", status: "Ready", region: "bom1", updated: "18m ago" },
  { name: "feat/design-system-v2", env: "Preview", status: "Building", region: "iad1", updated: "just now" },
  { name: "fix/otp-resend", env: "Preview", status: "Error", region: "fra1", updated: "3h ago" },
];
const statusVariant = { Ready: "success", Building: "warning", Error: "destructive" } as const;

export function DisplayDocs() {
  return (
    <>
      <DocSection id="tabs" eyebrow="Navigation" title="Tabs" description="Pill tabs for in-card switching, line tabs for page-level sections.">
        <Demo stageClassName="grid gap-8 md:grid-cols-2 items-start" code={`<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTab value="overview">Overview</TabsTab>
    <TabsTab value="logs">Logs</TabsTab>
  </TabsList>
  <TabsPanel value="overview">…</TabsPanel>
</Tabs>`}>
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTab value="preview">Preview</TabsTab>
              <TabsTab value="code">Code</TabsTab>
              <TabsTab value="tokens">Tokens</TabsTab>
            </TabsList>
            <TabsPanel value="preview" className="text-sm text-muted-foreground">Pill tabs sit on a muted track; the active tab lifts onto the card surface.</TabsPanel>
            <TabsPanel value="code" className="text-sm text-muted-foreground">Code panel.</TabsPanel>
            <TabsPanel value="tokens" className="text-sm text-muted-foreground">Tokens panel.</TabsPanel>
          </Tabs>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTab value="overview">Overview</TabsTab>
              <TabsTab value="deployments">Deployments</TabsTab>
              <TabsTab value="logs">Logs</TabsTab>
              <TabsTab value="settings">Settings</TabsTab>
            </TabsList>
            <TabsPanel value="overview" className="text-sm text-muted-foreground">Line tabs underline the active item in the foreground color.</TabsPanel>
            <TabsPanel value="deployments" className="text-sm text-muted-foreground">Deployments.</TabsPanel>
            <TabsPanel value="logs" className="text-sm text-muted-foreground">Logs.</TabsPanel>
            <TabsPanel value="settings" className="text-sm text-muted-foreground">Settings.</TabsPanel>
          </Tabs>
        </Demo>
      </DocSection>

      <DocSection id="breadcrumb" eyebrow="Navigation" title="Breadcrumb and pagination">
        <Demo stageClassName="flex-col items-start gap-6" code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="#">Acme</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

<Pagination pageCount={12} defaultPage={4} />`}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Acme Studio</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Projects</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>convex-starter-web</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Pagination pageCount={12} defaultPage={4} />
        </Demo>
      </DocSection>

      <DocSection id="accordion" eyebrow="Disclosure" title="Accordion and collapsible">
        <Demo stageClassName="grid gap-8 md:grid-cols-2 items-start" code={`<Accordion defaultValue={["a"]}>
  <AccordionItem value="a">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes.</AccordionContent>
  </AccordionItem>
</Accordion>`}>
          <Accordion defaultValue={["a"]} className="w-full">
            <AccordionItem value="a">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes. Built on ui-sdk primitives with full keyboard support and ARIA wiring.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Can I theme it?</AccordionTrigger>
              <AccordionContent>Every color, radius and shadow is a CSS variable.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>Does it animate?</AccordionTrigger>
              <AccordionContent>Height and the plus icon ease out in 200ms.</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Collapsible className="surface w-full rounded-xl">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-[13px] font-medium">
              3 environment variables
              <ChevronsUpDown className="size-3.5 text-faint-foreground" />
            </CollapsibleTrigger>
            <CollapsiblePanel className="border-t border-border px-4 py-3 font-mono text-xs text-muted-foreground">
              <p>CONVEX_DEPLOYMENT=dev:acme-123</p>
              <p>NEXT_PUBLIC_CONVEX_URL=https://…</p>
              <p>POLAR_ACCESS_TOKEN=••••••••</p>
            </CollapsiblePanel>
          </Collapsible>
        </Demo>
      </DocSection>

      <DocSection id="badge" eyebrow="Data display" title="Badge">
        <Demo code={`<Badge>Default</Badge>
<Badge variant="brand" dot>New</Badge>
<Badge variant="success" dot>Ready</Badge>`}>
          <Badge>Default</Badge>
          <Badge variant="solid">Solid</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="brand" dot>New</Badge>
          <Badge variant="success" dot>Ready</Badge>
          <Badge variant="warning" dot>Building</Badge>
          <Badge variant="info" dot>Queued</Badge>
          <Badge variant="destructive" dot>Error</Badge>
        </Demo>
      </DocSection>

      <DocSection id="avatar" eyebrow="Data display" title="Avatar">
        <Demo code={`<Avatar>
  <AvatarImage src="/me.png" alt="" />
  <AvatarFallback>AR</AvatarFallback>
</Avatar>`}>
          {["size-6", "size-8", "size-10", "size-12"].map((s, i) => (
            <Avatar key={s} className={s}>
              <AvatarFallback className="bg-[linear-gradient(135deg,var(--chart-1),var(--chart-3))] text-white">{["A", "AR", "SR", "KW"][i]}</AvatarFallback>
            </Avatar>
          ))}
          <div className="flex -space-x-2">
            {["AR", "SR", "KW", "LF"].map((n, i) => (
              <Avatar key={n} className="size-8 ring-2 ring-background">
                <AvatarFallback style={{ background: `var(--chart-${i + 1})` }} className="text-white">{n}</AvatarFallback>
              </Avatar>
            ))}
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-2 ring-background">+8</span>
          </div>
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src="/does-not-exist.png" alt="" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-background" />
          </div>
        </Demo>
      </DocSection>

      <DocSection id="card" eyebrow="Data display" title="Card" description="Raised (default), flat and ghost. Hairline + inner highlight + soft layered shadow.">
        <Demo stageClassName="grid gap-4 md:grid-cols-3 items-stretch" code={`<Card>
  <CardHeader>
    <CardTitle>Usage</CardTitle>
    <CardDescription>Resets on Dec 1</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`}>
          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>Resets on Dec 1</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Progress value={62} label="Credits" />
              <Progress value={28} label="Storage" />
            </CardContent>
          </Card>
          <Card variant="flat">
            <CardHeader>
              <CardTitle>Flat card</CardTitle>
              <CardDescription>For nested or dense groups.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">No shadow, just the hairline.</CardContent>
            <CardFooter className="justify-end">
              <Button size="sm" variant="secondary">Manage</Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden">
            <div aria-hidden="true" className="absolute -top-16 -right-10 size-40 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_25%,transparent),transparent)]" />
            <CardHeader>
              <CardTitle>Monthly revenue</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">$12,480</p>
              <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-success-text"><ArrowUpRight className="size-3" /> +12.4%</p>
            </CardContent>
          </Card>
        </Demo>
      </DocSection>

      <DocSection id="table" eyebrow="Data display" title="Table" description="Compact rows, hairlines only, sticky blurred header, tabular numbers.">
        <Demo stageClassName="block p-0" code={`<Table>
  <TableHeader>
    <TableRow><TableHead>Name</TableHead>…</TableRow>
  </TableHeader>
  <TableBody>…</TableBody>
</Table>`}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Project</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Updated</TableHead>
                <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.env}</TableCell>
                  <TableCell><Badge dot variant={statusVariant[r.status as keyof typeof statusVariant]}>{r.status}</Badge></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.region}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{r.updated}</TableCell>
                  <TableCell><Button size="icon-xs" variant="ghost" aria-label="Row actions"><MoreHorizontal /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Demo>
      </DocSection>

      <DocSection id="alert" eyebrow="Feedback" title="Alert and toast">
        <Demo stageClassName="grid gap-3 md:grid-cols-2" code={`<Alert variant="warning">
  <AlertTitle>Payment method expiring</AlertTitle>
  <AlertDescription>Update your card before Dec 1.</AlertDescription>
</Alert>`}>
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>You can switch themes from the header at any time.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertTitle>Scheduled maintenance</AlertTitle>
            <AlertDescription>Convex will be read-only on Sunday 02:00–02:15 IST.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Deployment ready</AlertTitle>
            <AlertDescription>convex-starter-web is live on production.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Payment method expiring</AlertTitle>
            <AlertDescription>Update your card before Dec 1 to avoid interruption.</AlertDescription>
          </Alert>
          <Alert variant="destructive" className="md:col-span-2">
            <AlertTitle>Build failed</AlertTitle>
            <AlertDescription>Type error in src/app/page.tsx:42. Check the logs for details.</AlertDescription>
          </Alert>
        </Demo>
        <Demo title="Toast" code={`import { toast } from "@ui-sdk/react/toast";

toast.success("Saved", { description: "Your changes are live." });`}>
          <Button variant="secondary" onClick={() => toast("Event created", { description: "Sunday, December 3 at 9:00 AM" })}>Default</Button>
          <Button variant="secondary" onClick={() => toast.success("Deployment ready", { description: "convex-starter-web is live." })}>Success</Button>
          <Button variant="secondary" onClick={() => toast.warning("Usage at 80%", { description: "You have 10 credits left." })}>Warning</Button>
          <Button variant="secondary" onClick={() => toast.error("Upload failed", { description: "Images must be 10 MB or smaller." })}>Error</Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.promise(new Promise((r) => setTimeout(r, 1500)), { loading: "Publishing…", success: "Published", error: "Failed" })
            }
          >
            Promise
          </Button>
        </Demo>
      </DocSection>

      <DocSection id="progress" eyebrow="Feedback" title="Progress, meter, spinner and skeleton">
        <Demo stageClassName="grid gap-8 md:grid-cols-3 items-start" code={`<Progress value={64} label="Uploading" />
<Spinner size={20} />
<Skeleton className="h-4 w-40" />`}>
          <div className="grid gap-5">
            <Progress value={64} label="Uploading hero.png" />
            <Meter value={72} className="grid grid-cols-2 gap-y-2">
              <MeterLabel className="text-[13px] font-medium">Storage</MeterLabel>
              <MeterValue className="justify-self-end font-mono text-xs text-muted-foreground" />
              <MeterTrack className="col-span-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <MeterIndicator className="rounded-full bg-warning" />
              </MeterTrack>
            </Meter>
          </div>
          <div className="flex items-center gap-5">
            <StateCell label="14px"><Spinner size={14} /></StateCell>
            <StateCell label="20px"><Spinner size={20} /></StateCell>
            <StateCell label="In button"><Button size="sm" disabled><Spinner /> Saving</Button></StateCell>
          </div>
          <div className="flex w-full items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </Demo>
      </DocSection>

      <DocSection id="empty" eyebrow="Feedback" title="Empty state">
        <Demo stageClassName="block" code={`<EmptyState
  icon={<FolderOpen />}
  title="No projects yet"
  description="Create your first project to start deploying."
  action={<Button size="sm"><Plus /> New project</Button>}
/>`}>
          <EmptyState
            icon={<FolderOpen />}
            title="No projects yet"
            description="Create your first project to start deploying. It takes about a minute."
            action={<Button size="sm"><Plus /> New project</Button>}
          />
        </Demo>
      </DocSection>

      <DocSection id="dialog" eyebrow="Overlays" title="Dialog and sheet" description="Neutral blurred backdrop, floating surface, 2xl radius.">
        <Demo code={`<Dialog>
  <DialogTrigger render={<Button variant="secondary" />}>Edit profile</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>…</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`}>
          <Dialog>
            <DialogTrigger render={<Button variant="secondary" />}>Edit profile</DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Changes are visible to your teammates.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="dlg-name" className="text-[13px]">Name</Label>
                  <Input id="dlg-name" defaultValue="Abhishek Raj" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="dlg-handle" className="text-[13px]">Handle</Label>
                  <Input id="dlg-handle" defaultValue="@abhishek" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                <DialogClose render={<Button />}>Save changes</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger render={<Button variant="destructive-soft" />}>Delete project</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Delete project?</DialogTitle>
                <DialogDescription>This permanently removes convex-starter-web and its deployments.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                <DialogClose render={<Button variant="destructive" />}>Delete</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger render={<Button variant="secondary" />}>Open sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>Choose what you hear about.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-2 px-4 text-sm text-muted-foreground">
                <p>Deployments, billing, mentions.</p>
              </div>
              <SheetFooter>
                <Button>Save</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Demo>
      </DocSection>

      <DocSection id="popover" eyebrow="Overlays" title="Popover, tooltip and hover card">
        <Demo code={`<Tooltip>
  <TooltipTrigger render={<Button variant="secondary" size="icon" aria-label="Notifications" />}>
    <Bell />
  </TooltipTrigger>
  <TooltipContent>Notifications <Kbd>G N</Kbd></TooltipContent>
</Tooltip>`}>
          <Popover>
            <PopoverTrigger render={<Button variant="secondary" />}>Share</PopoverTrigger>
            <PopoverContent className="grid gap-3">
              <div>
                <PopoverTitle className="text-sm font-semibold">Share this project</PopoverTitle>
                <PopoverDescription className="text-[13px] text-muted-foreground">Anyone with the link can view.</PopoverDescription>
              </div>
              <div className="flex gap-2">
                <Input readOnly defaultValue="convex-starter.dev/p/acme" className="h-8 text-[13px]" />
                <Button size="sm"><Share2 /> Copy</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger render={<Button variant="secondary" size="icon" aria-label="Notifications" />}>
              <Bell />
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <HoverCard>
            <HoverCardTrigger render={<a href="#popover" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline" />}>@abhishekraj007</HoverCardTrigger>
            <HoverCardContent className="surface-float z-50 w-72 rounded-xl p-4">
              <div className="flex gap-3">
                <Avatar className="size-10"><AvatarFallback>AR</AvatarFallback></Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-semibold">Abhishek Raj</p>
                  <p className="text-[13px] text-muted-foreground">Building convex-starter: Next.js, Expo and Convex.</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Demo>
      </DocSection>

      <DocSection
        id="menu"
        eyebrow="Overlays"
        title="Dropdown menu"
        description="ui-sdk has no context-menu primitive; right-click menus should reuse DropdownMenu content anchored to the pointer."
      >
        <Demo code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="secondary" />}>Account</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem><User /> Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" />}>
              Account <ChevronsUpDown className="text-faint-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56" align="start">
              <DropdownMenuLabel>abhishek@acme.dev</DropdownMenuLabel>
              <DropdownMenuItem><User /> Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem><CreditCard /> Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem><Settings /> Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><LogOut /> Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Row actions" />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem><Pencil /> Rename</DropdownMenuItem>
              <DropdownMenuItem><Share2 /> Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive-text data-highlighted:text-destructive-text"><Trash2 /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Demo>
      </DocSection>

      <DocSection id="kbd" eyebrow="Primitives" title="Kbd and separator">
        <Demo stageClassName="flex-col items-start gap-5" code={`<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
<Separator />`}>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">Command menu <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup></span>
            <span className="flex items-center gap-2">New issue <Kbd>C</Kbd></span>
            <span className="flex items-center gap-2">Go to inbox <KbdGroup><Kbd>G</Kbd><Kbd>I</Kbd></KbdGroup></span>
          </div>
          <Separator />
          <div className="flex h-5 items-center gap-4 text-[13px] text-muted-foreground">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>Changelog</span>
            <Separator orientation="vertical" />
            <span>Status</span>
          </div>
        </Demo>
      </DocSection>
    </>
  );
}
