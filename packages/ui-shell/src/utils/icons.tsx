"use client";

import { createElement, type CSSProperties } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BatteryWarning,
  Bell, Calendar, Check, CheckCircle, ChevronDown,
  ChevronLeft, ChevronRight, ChevronUp, CircleCheckBig,
  Clock, Cloud, CloudUpload, CreditCard, Cpu,
  Download, Droplets, FileText, Filter, Flame,
  Globe, GripVertical, HardDrive, HelpCircle, Home,
  Key, LayoutDashboard, LayoutGrid, Gauge, LifeBuoy,
  Loader2, LogOut, MapPin, Menu, MessageSquare,
  Minus, Monitor, Package, PanelLeftClose, PanelLeftOpen,
  Plug, Plus, Radio, Receipt, RefreshCw, Search,
  Server, Settings, Shield, ShieldCheck, SlidersHorizontal,
  SquareX, TrendingUp, User, Wifi, WifiOff,
  Wrench, X, Zap, Layers,
  type LucideIcon, type LucideProps,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Activity, AlertTriangle, ArrowRight, BatteryWarning,
  Bell, Calendar, Check, CheckCircle, ChevronDown,
  ChevronLeft, ChevronRight, ChevronUp, CircleCheckBig,
  Clock, Cloud, CloudUpload, CreditCard, Cpu,
  Download, Droplets, FileText, Filter, Flame,
  Gauge, Globe, GripVertical, HardDrive, HelpCircle, Home,
  Key, Layers, LayoutDashboard, LayoutGrid, LifeBuoy,
  Loader2, LogOut, MapPin, Menu, MessageSquare,
  Minus, Monitor, Package, PanelLeftClose, PanelLeftOpen,
  Plug, Plus, Radio, Receipt, RefreshCw, Search,
  Server, Settings, Shield, ShieldCheck, SlidersHorizontal,
  SquareX, TrendingUp, User, Wifi, WifiOff,
  Wrench, X, Zap,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Server;
}

export interface DynamicIconProps {
  name: string;
  className?: string;
  style?: CSSProperties;
}

export function DynamicIcon({ name, className, style }: DynamicIconProps) {
  return createElement(getIcon(name), { className, style } as LucideProps);
}
