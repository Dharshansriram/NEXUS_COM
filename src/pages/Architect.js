import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Zap, Leaf, Thermometer, Volume2, TrendingUp, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/GlassCard";
import ScoreMeter from "@/components/ScoreMeter";
import { getMultiStrategyRecommendation } from "@/services/recommendationEngine";
const USAGE_TYPES = [
  { value: "gaming", label: "Gaming", icon: "\u{1F3AE}" },
  { value: "programming", label: "Development", icon: "\u{1F4BB}" },
  { value: "editing", label: "Video/Photo", icon: "\u{1F3AC}" },
  { value: "ai_ml", label: "AI / ML", icon: "\u{1F9E0}" },
  { value: "student", label: "Student", icon: "\u{1F4DA}" },
  { value: "office", label: "Office", icon: "\u{1F4CA}" }
];
const STRATEGIES = [
  { key: "performance", label: "Performance Optimized", icon: Zap, color: "text-primary" },
  { key: "efficiency", label: "Efficiency Optimized", icon: Leaf, color: "text-success" },
  { key: "thermal", label: "Thermal Optimized", icon: Thermometer, color: "text-warning" },
  { key: "silent", label: "Silent Operation", icon: Volume2, color: "text-accent" },
  { key: "upgrade", label: "Upgrade Friendly", icon: TrendingUp, color: "text-info" }
];
const Architect = () => {
  const navigate = useNavigate();
  const [usage, setUsage] = useState("");
  const [budget, setBudget] = useState("high");
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [stacks, setStacks] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState("performance");
  const generate = async () => {
    if (!usage) return;
    setLoading(true);
    try {
      const result = await getMultiStrategyRecommendation({
        usageType: usage,
        budgetTier: budget,
        performancePriority: "balanced",
        preferredBrand: brand || void 0
      });
      setStacks(result);
      setActiveStrategy("performance");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  const activeBuild = stacks?.[activeStrategy];
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center glow-border", children: /* @__PURE__ */ jsx(Layers, { className: "w-5 h-5 text-accent" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Architecture Engine" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Multi-strategy hardware recommendations" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(GlassCard, { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-2 block", children: "Workload" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1.5", children: USAGE_TYPES.map((u) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setUsage(u.value),
            className: `p-2 rounded-lg text-center text-xs font-medium transition-all ${usage === u.value ? "bg-primary/15 text-primary border border-primary/30 glow-border" : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg mb-0.5", children: u.icon }),
              u.label
            ]
          },
          u.value
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-2 block", children: "Budget Tier" }),
        /* @__PURE__ */ jsxs(Select, { value: budget, onValueChange: (v) => setBudget(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-secondary/50 border-border/50", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "budget", children: "Budget" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "mid", children: "Mid-Range" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "high", children: "High-End" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "premium", children: "Premium" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-2 block", children: "Brand Preference" }),
        /* @__PURE__ */ jsxs(Select, { value: brand, onValueChange: setBrand, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-secondary/50 border-border/50", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Any" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Any" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "AMD", children: "AMD" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Intel", children: "Intel" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "NVIDIA", children: "NVIDIA" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: generate, disabled: !usage || loading, className: "h-10", children: [
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 mr-2" }),
        "Generate Stacks"
      ] })
    ] }) }),
    stacks && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1", children: STRATEGIES.map((s) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveStrategy(s.key),
          className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activeStrategy === s.key ? "bg-primary/15 text-primary glow-border" : "glass text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsx(s.icon, { className: `w-3.5 h-3.5 ${activeStrategy === s.key ? s.color : ""}` }),
            s.label
          ]
        },
        s.key
      )) }),
      activeBuild && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        activeBuild.bottleneckWarning && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30 text-warning text-sm", children: [
          /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 flex-shrink-0" }),
          activeBuild.bottleneckWarning
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3", children: [
          { key: "cpu", label: "CPU", data: activeBuild.cpu, specs: [`${activeBuild.cpu.cores}C/${activeBuild.cpu.threads}T`, activeBuild.cpu.socket, `${activeBuild.cpu.tdp}W`] },
          { key: "gpu", label: "GPU", data: activeBuild.gpu, specs: [`${activeBuild.gpu.vram}GB VRAM`, `${activeBuild.gpu.power_consumption}W`] },
          { key: "motherboard", label: "Motherboard", data: activeBuild.motherboard, specs: [activeBuild.motherboard.socket, activeBuild.motherboard.chipset] },
          { key: "ram", label: "RAM", data: activeBuild.ram, specs: [`${activeBuild.ram.capacity}GB`, activeBuild.ram.type, `${activeBuild.ram.speed}MHz`] },
          { key: "storage", label: "Storage", data: activeBuild.storage, specs: [activeBuild.storage.type, `${activeBuild.storage.capacity}GB`] },
          { key: "psu", label: "PSU", data: activeBuild.psu, specs: [`${activeBuild.psu.wattage}W`, activeBuild.psu.efficiency_rating] },
          { key: "cooling", label: "Cooling", data: activeBuild.cooling, specs: [activeBuild.cooling.type] },
          { key: "cabinet", label: "Case", data: activeBuild.cabinet, specs: [activeBuild.cabinet.form_factor] }
        ].map((c) => /* @__PURE__ */ jsxs(GlassCard, { className: "group", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: c.label }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm mb-3 leading-tight", children: c.data.name }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: c.specs.map((s, i) => /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono", children: s }, i)) }),
          /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(ScoreMeter, { label: "Tier Match", value: c.data.price_tier === "premium" ? 95 : c.data.price_tier === "high" ? 75 : c.data.price_tier === "mid" ? 50 : 25, size: "sm" }) })
        ] }, c.key)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mt-6", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => navigate("/laboratory"), className: "glass", children: [
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 mr-2" }),
            "Compare in Lab"
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => navigate("/intelligence"), className: "glass", children: [
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 mr-2" }),
            "Run Intelligence Analysis"
          ] })
        ] })
      ] })
    ] }),
    !stacks && !loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-24 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Layers, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Select a workload and generate stacks to see multi-strategy recommendations" })
    ] })
  ] });
};
var stdin_default = Architect;
export {
  stdin_default as default
};
