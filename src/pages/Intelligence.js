import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BarChart3, Zap, Shield, Thermometer, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/GlassCard";
import ScoreMeter from "@/components/ScoreMeter";
import { getRecommendation } from "@/services/recommendationEngine";
import { analyzeCompatibility } from "@/services/compatibilityEngine";
const Intelligence = () => {
  const [usage, setUsage] = useState("gaming");
  const [budget, setBudget] = useState("high");
  const [loading, setLoading] = useState(false);
  const [build, setBuild] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const runAnalysis = async () => {
    setLoading(true);
    try {
      const b = await getRecommendation({ usageType: usage, performancePriority: "balanced", budgetTier: budget });
      setBuild(b);
      setAnalysis(analyzeCompatibility(b));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center glow-border", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5 text-warning" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Compatibility Intelligence" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Deep analysis: compatibility, bottlenecks, thermal risk" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(GlassCard, { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-2 block", children: "Workload" }),
        /* @__PURE__ */ jsxs(Select, { value: usage, onValueChange: (v) => setUsage(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-secondary/50", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "gaming", children: "Gaming" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "programming", children: "Development" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "editing", children: "Video/Photo" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "ai_ml", children: "AI / ML" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "student", children: "Student" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "office", children: "Office" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-2 block", children: "Budget Tier" }),
        /* @__PURE__ */ jsxs(Select, { value: budget, onValueChange: (v) => setBudget(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-secondary/50", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "budget", children: "Budget" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "mid", children: "Mid-Range" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "high", children: "High-End" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "premium", children: "Premium" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: runAnalysis, disabled: loading, children: [
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 mr-2" }),
        "Run Analysis"
      ] })
    ] }) }),
    analysis && build && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(GlassCard, { glow: true, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Compatibility Score" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-4xl font-black font-mono text-primary mb-2", children: [
            analysis.compatibilityScore,
            "%"
          ] }),
          /* @__PURE__ */ jsx(ScoreMeter, { label: "Overall", value: analysis.compatibilityScore, color: analysis.compatibilityScore > 80 ? "success" : analysis.compatibilityScore > 50 ? "warning" : "destructive" })
        ] }),
        /* @__PURE__ */ jsxs(GlassCard, { glow: true, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx(Thermometer, { className: "w-5 h-5 text-warning" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Thermal Risk" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-4xl font-black font-mono mb-2", style: { color: analysis.thermalRisk < 30 ? "hsl(160, 84%, 39%)" : analysis.thermalRisk < 60 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 51%)" }, children: [
            analysis.thermalRisk,
            "%"
          ] }),
          /* @__PURE__ */ jsx(ScoreMeter, { label: "Heat Risk", value: analysis.thermalRisk, color: analysis.thermalRisk < 30 ? "success" : analysis.thermalRisk < 60 ? "warning" : "destructive" })
        ] }),
        /* @__PURE__ */ jsxs(GlassCard, { glow: true, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5 text-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Bottleneck" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-4xl font-black font-mono mb-2", style: { color: analysis.bottleneckPct < 15 ? "hsl(160, 84%, 39%)" : analysis.bottleneckPct < 35 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 51%)" }, children: [
            analysis.bottleneckPct,
            "%"
          ] }),
          /* @__PURE__ */ jsx(ScoreMeter, { label: "CPU\u2194GPU Imbalance", value: analysis.bottleneckPct, color: analysis.bottleneckPct < 15 ? "success" : analysis.bottleneckPct < 35 ? "warning" : "destructive" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4", children: "Compatibility Checks" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.checks.map((check, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-secondary/30", children: [
          check.pass ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-success flex-shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-warning flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: check.label }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: check.detail })
          ] })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4", children: "Analyzed Configuration" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          { label: "CPU", value: build.cpu.name },
          { label: "GPU", value: build.gpu.name },
          { label: "Motherboard", value: build.motherboard.name },
          { label: "RAM", value: build.ram.name },
          { label: "Storage", value: build.storage.name },
          { label: "PSU", value: build.psu.name },
          { label: "Cooling", value: build.cooling.name },
          { label: "Case", value: build.cabinet.name }
        ].map((c) => /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-secondary/30", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: c.label }),
          /* @__PURE__ */ jsx("div", { className: "text-xs font-medium mt-1 leading-tight", children: c.value })
        ] }, c.label)) })
      ] })
    ] }),
    !analysis && !loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-24 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(BarChart3, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Run an analysis to see compatibility, thermal, and bottleneck intelligence" })
    ] })
  ] });
};
var stdin_default = Intelligence;
export {
  stdin_default as default
};
