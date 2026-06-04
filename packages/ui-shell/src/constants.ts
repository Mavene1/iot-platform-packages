export const CATEGORY_STYLES: Record<
  string,
  { iconBg: string; iconText: string; activeBg: string; activeText: string }
> = {
  connectivity:   { iconBg: "bg-blue-50",   iconText: "text-blue-600",   activeBg: "bg-blue-50",   activeText: "text-blue-700"   },
  utilities:      { iconBg: "bg-amber-50",  iconText: "text-amber-600",  activeBg: "bg-amber-50",  activeText: "text-amber-700"  },
  infrastructure: { iconBg: "bg-purple-50", iconText: "text-purple-600", activeBg: "bg-purple-50", activeText: "text-purple-700" },
};

export const DEFAULT_STYLE = {
  iconBg: "bg-gray-100",
  iconText: "text-gray-600",
  activeBg: "bg-gray-50",
  activeText: "text-gray-700",
};

export const DRAWER_W = 280;
