import {
  MessageSquare, Globe, Cloud, Droplets, Package, Radio, Zap,
  Monitor, HardDrive, ShieldCheck, ShieldAlert, ShieldOff, Wifi, Cpu, Server,
  Network, LayoutGrid, LayoutDashboard, Layers, CreditCard, LifeBuoy,
  Search, Bell, HelpCircle, Key, KeyRound, LogIn, LogOut,
  UserPlus, UserCheck, UserX, User, BookOpen, BookMarked, Code, Code2,
  Blocks, ChevronRight, ChevronLeft, ChevronDown, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight, Plus, Minus, X,
  Check, CheckCheck, CheckCircle, CheckCircle2, CheckSquare,
  Receipt, Settings, Menu, Users, Shield, UsersRound, ClipboardList,
  ClipboardCheck, History, SmartphoneNfc, MonitorSmartphone, FileText,
  TrendingUp, TrendingDown, Wallet, Calendar, CalendarDays, Building2,
  Smartphone, Tablet, PieChart, BarChart2, BarChart3, AlertCircle,
  AlertTriangle, BellRing, BadgePercent, Sliders, SlidersHorizontal,
  Mail, MailOpen, Webhook, Activity, Plug, Unlink,
  Link, ExternalLink, Share2, Copy, Download, Upload, Eye, Lock, Loader2,
  RefreshCw, RotateCcw, MapPin, Home, Hash, Tag, Star, Gauge, Signal,
  Battery, Sparkles, Rocket, Play, Square, Pencil, Trash2, MoreVertical,
  Quote, ThumbsUp, Timer, Clock, ToggleLeft, ToggleRight, Sun, Moon,
  Info, Fingerprint, Leaf, Truck, Car, Video, XCircle, GripVertical,
  ChevronUp, CircleCheckBig, SquareX, AppWindow, BarChart, CloudUpload,
  TriangleAlert,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { createElement, type CSSProperties } from "react";

const iconMap: Record<string, LucideIcon> = {
  MessageSquare, Globe, Cloud, Droplets, Package, Radio, Zap,
  Monitor, HardDrive, ShieldCheck, ShieldAlert, ShieldOff, Wifi, Cpu, Server,
  Network, LayoutGrid, LayoutDashboard, Layers, CreditCard, LifeBuoy,
  Search, Bell, HelpCircle, Key, KeyRound, LogIn, LogOut,
  UserPlus, UserCheck, UserX, User, BookOpen, BookMarked, Code, Code2,
  Blocks, ChevronRight, ChevronLeft, ChevronDown, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight, Plus, Minus, X,
  Check, CheckCheck, CheckCircle, CheckCircle2, CheckSquare,
  Receipt, Settings, Menu, Users, Shield, UsersRound, ClipboardList,
  ClipboardCheck, History, SmartphoneNfc, MonitorSmartphone, FileText,
  TrendingUp, TrendingDown, Wallet, Calendar, CalendarDays, Building2,
  Smartphone, Tablet, PieChart, BarChart2, BarChart3, AlertCircle,
  AlertTriangle, BellRing, BadgePercent, Sliders, SlidersHorizontal,
  Mail, MailOpen, Webhook, Activity, Plug, Unlink,
  Link, ExternalLink, Share2, Copy, Download, Upload, Eye, Lock, Loader2,
  RefreshCw, RotateCcw, MapPin, Home, Hash, Tag, Star, Gauge, Signal,
  Battery, Sparkles, Rocket, Play, Square, Pencil, Trash2, MoreVertical,
  Quote, ThumbsUp, Timer, Clock, ToggleLeft, ToggleRight, Sun, Moon,
  Info, Fingerprint, Leaf, Truck, Car, Video, XCircle, GripVertical,
  ChevronUp, CircleCheckBig, SquareX, AppWindow, BarChart, CloudUpload,
  TriangleAlert,
};

export type { LucideIcon };

export interface DynamicIconProps {
  name: string;
  className?: string;
  style?: CSSProperties;
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Server;
}

/** Render a Lucide icon by string name — stable, avoids "component created during render" errors. */
export function DynamicIcon({ name, className, style }: DynamicIconProps) {
  return createElement(getIcon(name), { className, style } as LucideProps);
}
