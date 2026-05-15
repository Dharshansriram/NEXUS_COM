import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getComponentsByCategory } from "@/services/recommendationEngine";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
const CATEGORIES = [
  { value: "cpus", label: "CPUs" },
  { value: "gpus", label: "GPUs" },
  { value: "ram", label: "RAM" },
  { value: "storage", label: "Storage" }
];
const CHART_COLORS = [
  "hsl(200, 100%, 50%)",
  "hsl(280, 80%, 60%)",
  "hsl(160, 84%, 39%)",
  "hsl(38, 92%, 50%)"
];
const SPEC_KEYS = {
  cpus: [
    { key: "brand", label: "Brand" },
    { key: "cores", label: "Cores" },
    { key: "threads", label: "Threads" },
    { key: "socket", label: "Socket" },
    { key: "tdp", label: "TDP (W)" },
    { key: "benchmark_score", label: "Benchmark" },
    { key: "supported_ram_type", label: "RAM Type" },
    { key: "price_tier", label: "Tier" }
  ],
  gpus: [
    { key: "brand", label: "Brand" },
    { key: "vram", label: "VRAM (GB)" },
    { key: "benchmark_score", label: "Benchmark" },
    { key: "power_consumption", label: "Power (W)" },
    { key: "price_tier", label: "Tier" }
  ],
  ram: [
    { key: "capacity", label: "Capacity (GB)" },
    { key: "type", label: "Type" },
    { key: "speed", label: "Speed (MHz)" },
    { key: "price_tier", label: "Tier" }
  ],
  storage: [
    { key: "type", label: "Type" },
    { key: "capacity", label: "Capacity (GB)" },
    { key: "speed", label: "Speed (MB/s)" },
    { key: "price_tier", label: "Tier" }
  ]
};
const Laboratory = () => {
  const [category, setCategory] = useState("cpus");
  const [allItems, setAllItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setSelected([]);
    getComponentsByCategory(category).then((data) => {
      setAllItems(data || []);
      setLoading(false);
    });
  }, [category]);
  const toggleSelect = (id) => {
    setSelected(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };
  const selectedItems = allItems.filter((i) => selected.includes(i.id));
  const benchmarkKey = category === "cpus" || category === "gpus" ? "benchmark_score" : "speed";
  const chartData = selectedItems.map((i) => ({
    name: i.name.length > 18 ? i.name.slice(0, 18) + "\u2026" : i.name,
    value: i[benchmarkKey] ?? 0
  }));
  const radarData = category === "cpus" ? [
    { metric: "Cores", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), i.cores / 24 * 100])) },
    { metric: "Threads", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), i.threads / 48 * 100])) },
    { metric: "Benchmark", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), i.benchmark_score / 100 * 100])) },
    { metric: "Efficiency", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), Math.max(0, 100 - i.tdp)])) }
  ] : category === "gpus" ? [
    { metric: "VRAM", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), i.vram / 24 * 100])) },
    { metric: "Benchmark", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), i.benchmark_score / 100 * 100])) },
    { metric: "Efficiency", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), Math.max(0, 100 - i.power_consumption / 4)])) },
    { metric: "Power", ...Object.fromEntries(selectedItems.map((i) => [i.name.slice(0, 12), i.power_consumption / 400 * 100])) }
  ] : [];
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center glow-border", children: /* @__PURE__ */ jsx(FlaskConical, { className: "w-5 h-5 text-success" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Comparison Laboratory" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Select up to 4 components for deep analysis" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-6", children: CATEGORIES.map((c) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setCategory(c.value),
        className: `px-4 py-2 rounded-xl text-xs font-medium transition-all ${category === c.value ? "bg-primary/15 text-primary glow-border" : "glass text-muted-foreground hover:text-foreground"}`,
        children: c.label
      },
      c.value
    )) }),
    /* @__PURE__ */ jsxs(GlassCard, { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lab-items-list flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-hide", children: loading ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground py-4 w-full text-center", children: "Loading components..." }) : allItems.map((item) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => toggleSelect(item.id),
          className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected.includes(item.id) ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`,
          children: item.name
        },
        item.id
      )) }),
      /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground mt-2 font-mono", children: [
        selected.length,
        "/4 SELECTED"
      ] })
    ] }),
    selectedItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4", children: [
          benchmarkKey === "benchmark_score" ? "Benchmark Score" : "Speed",
          " Comparison"
        ] }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(BarChart, { data: chartData, children: [
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", tick: { fontSize: 10, fill: "hsl(220, 15%, 50%)" } }),
          /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 10, fill: "hsl(220, 15%, 50%)" } }),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              contentStyle: { backgroundColor: "hsl(228, 25%, 7%)", border: "1px solid hsl(228, 18%, 14%)", borderRadius: "8px", fontSize: "12px" }
            }
          ),
          /* @__PURE__ */ jsx(Bar, { dataKey: "value", radius: [6, 6, 0, 0], children: chartData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: CHART_COLORS[i % CHART_COLORS.length] }, i)) })
        ] }) })
      ] }),
      radarData.length > 0 && selectedItems.length >= 2 && /* @__PURE__ */ jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4", children: "Workload Suitability Radar" }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(RadarChart, { data: radarData, children: [
          /* @__PURE__ */ jsx(PolarGrid, { stroke: "hsl(228, 18%, 14%)" }),
          /* @__PURE__ */ jsx(PolarAngleAxis, { dataKey: "metric", tick: { fontSize: 10, fill: "hsl(220, 15%, 50%)" } }),
          /* @__PURE__ */ jsx(PolarRadiusAxis, { tick: false, domain: [0, 100] }),
          selectedItems.map((item, i) => /* @__PURE__ */ jsx(
            Radar,
            {
              name: item.name,
              dataKey: item.name.slice(0, 12),
              stroke: CHART_COLORS[i],
              fill: CHART_COLORS[i],
              fillOpacity: 0.15,
              strokeWidth: 2
            },
            item.id
          ))
        ] }) })
      ] })
    ] }),
    selectedItems.length > 0 && /* @__PURE__ */ jsxs(GlassCard, { className: "overflow-x-auto", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4", children: "Specification Matrix" }),
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left p-3 text-xs font-medium text-muted-foreground", children: "Spec" }),
          selectedItems.map((item, i) => /* @__PURE__ */ jsxs("th", { className: "text-left p-3 text-xs font-semibold", children: [
            /* @__PURE__ */ jsx("span", { style: { color: CHART_COLORS[i] }, children: "\u25CF" }),
            " ",
            item.name
          ] }, item.id))
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: SPEC_KEYS[category].map((spec) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/30", children: [
          /* @__PURE__ */ jsx("td", { className: "p-3 text-xs text-muted-foreground font-mono", children: spec.label }),
          selectedItems.map((item) => /* @__PURE__ */ jsx("td", { className: "p-3 text-xs font-medium", children: Array.isArray(item[spec.key]) ? item[spec.key].join(", ") : String(item[spec.key] ?? "\u2014") }, item.id))
        ] }, spec.key)) })
      ] })
    ] }),
    selectedItems.length === 0 && !loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-24 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(FlaskConical, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Select components above to begin laboratory analysis" })
    ] })
  ] });
};
var stdin_default = Laboratory;
export {
  stdin_default as default
};
