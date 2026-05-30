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
export { Skeleton } from "./components/skeleton";
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

// Hooks
export { useDebounce } from "./hooks/use-debounce";
export { useMediaQuery } from "./hooks/use-media-query";
