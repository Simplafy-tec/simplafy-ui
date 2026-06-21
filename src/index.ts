"use client";

// Utilities
export { cn } from "./lib/utils";

// Components
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/card";
export { Input } from "./components/input";
export { Label } from "./components/label";
export { Checkbox } from "./components/checkbox";
export { Separator } from "./components/separator";
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
export { Avatar, AvatarImage, AvatarFallback } from "./components/avatar";
export { Skeleton, type SkeletonComponent } from "./components/skeleton";
export { Empty, type EmptyProps } from "./components/empty";
export { ErrorBoundary, type ErrorBoundaryProps, type ErrorBoundaryFallbackProps } from "./components/error-boundary";
export { ModalConfirm, Modal, type ModalConfirmProps } from "./components/modal-confirm";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/dropdown-menu";
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./components/sheet";
export { ScrollArea, ScrollBar } from "./components/scroll-area";
export { Switch } from "./components/switch";
export { Textarea } from "./components/textarea";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/tabs";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/select";
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./components/popover";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./components/command";
export { Progress } from "./components/progress";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/table";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/tooltip";

// Charts
export {
  MetricCard,
  type MetricCardProps,
} from "./components/metric-card";
export {
  ChartTooltip,
  type ChartTooltipProps,
  type ChartTooltipPayload,
} from "./components/chart-tooltip";
export {
  SimpleBarChart,
  CHART_COLORS,
  type BarChartSeries,
  type SimpleBarChartProps,
} from "./components/bar-chart";
export {
  SimpleLineChart,
  type LineChartSeries,
  type SimpleLineChartProps,
} from "./components/line-chart";

// Configurações — hierarquia de título / secção (Hub 2.0)
export {
  SettingsPageHeader,
  SettingsInsetSection,
  SettingsSectionHeading,
  type SettingsPageHeaderProps,
  type SettingsInsetSectionProps,
  type SettingsSectionHeadingProps,
} from "./components/settings-page";


// Hub — integrações (KB, canais, OAuth)
export {
  ProviderLogo,
  type ProviderLogoProps,
  type ProviderLogoId,
} from "./components/provider-logo";
export {
  AccessBadge,
  accessBadgeVariants,
  type AccessBadgeProps,
  type AccessKind,
} from "./components/access-badge";
export {
  AccessNote,
  accessNoteVariants,
  type AccessNoteProps,
} from "./components/access-note";
export {
  SyncPill,
  syncPillVariants,
  type SyncPillProps,
  type SyncPillStatus,
} from "./components/sync-pill";
export {
  OAuthConsent,
  type OAuthConsentProps,
  type OAuthConsentState,
} from "./components/oauth-consent";

// Hooks
export { useDebounce } from "./hooks/use-debounce";
export { useMediaQuery } from "./hooks/use-media-query";
