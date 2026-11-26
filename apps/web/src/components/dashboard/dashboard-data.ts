export type SummaryCard = {
  key: "sales" | "orders" | "visitors" | "products";
  label: string;
  value: string;
  delta: number;
  caption: string;
  hero?: boolean;
};

export const summaryCards: SummaryCard[] = [
  { key: "sales", label: "Total Sales", value: "$612,917", delta: 2.08, caption: "Products vs last month", hero: true },
  { key: "orders", label: "Total Orders", value: "34,760", delta: 12.4, caption: "Orders vs last month" },
  { key: "visitors", label: "Visitor", value: "14,987", delta: -2.08, caption: "Users vs last month" },
  { key: "products", label: "Total Sold Products", value: "12,987", delta: 12.1, caption: "Products vs last month" },
];

export const productStatistic = {
  total: "9,829",
  delta: 5.34,
  label: "Products Sales",
  rings: [0.94, 0.8, 0.45, 0.32],
  categories: [
    { key: "electronic", label: "Electronic", value: "2,487", delta: 1.8 },
    { key: "games", label: "Games", value: "1,828", delta: 2.3 },
    { key: "furniture", label: "Furniture", value: "1,463", delta: -1.04 },
  ],
};

export const customerHabits = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  seen: [23, 44, 15, 47, 22, 30, 28],
  sales: [39, 31, 12, 36, 12, 21, 14],
  max: 60,
  tooltip: { month: "Apr", seen: "43.787", sales: "39.784" },
};

export const customerGrowth = {
  bubbles: [
    { key: "a", value: "2,417", className: "right-1 top-1 size-28 bg-brand text-brand-foreground" },
    { key: "b", value: "2,281", className: "bottom-1 left-3 size-24 bg-chart-2 text-foreground/80" },
    { key: "c", value: "812", className: "right-8 bottom-0 size-14 bg-brand/30 text-foreground" },
    { key: "d", value: "287", className: "top-0 left-0 size-14 bg-brand/12 text-brand-text" },
  ],
  countries: [
    { code: "US", name: "United States", value: 2417, share: 0.78 },
    { code: "DE", name: "Germany", value: 1828, share: 0.59 },
    { code: "AU", name: "Australia", value: 1263, share: 0.41 },
    { code: "FR", name: "France", value: 986, share: 0.32 },
  ],
};
