import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/GlassCard";
import { getRecommendation } from "@/services/recommendationEngine";
import { analyzeCompatibility } from "@/services/compatibilityEngine";
import { apiFetch } from "@/lib/api";
const Report = () => {
  const [usage, setUsage] = useState("gaming");
  const [budget, setBudget] = useState("high");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const generateReport = async () => {
    setLoading(true);
    setReport("");
    try {
      const build = await getRecommendation({ usageType: usage, performancePriority: "balanced", budgetTier: budget });
      const compat = analyzeCompatibility(build);
      const data = await apiFetch("/api/ai-chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate a comprehensive Engineering Advisory Report for this PC build:

**Workload**: ${usage}
**Budget Tier**: ${budget}

**Configuration:**
- CPU: ${build.cpu.name} (${build.cpu.cores}C/${build.cpu.threads}T, ${build.cpu.socket}, ${build.cpu.tdp}W TDP, Score: ${build.cpu.benchmark_score})
- GPU: ${build.gpu.name} (${build.gpu.vram}GB VRAM, ${build.gpu.power_consumption}W, Score: ${build.gpu.benchmark_score})
- Motherboard: ${build.motherboard.name} (${build.motherboard.socket}, ${build.motherboard.chipset})
- RAM: ${build.ram.name} (${build.ram.capacity}GB ${build.ram.type} @ ${build.ram.speed}MHz)
- Storage: ${build.storage.name} (${build.storage.type}, ${build.storage.capacity}GB)
- PSU: ${build.psu.name} (${build.psu.wattage}W, ${build.psu.efficiency_rating})
- Cooling: ${build.cooling.name} (${build.cooling.type})
- Case: ${build.cabinet.name} (${build.cabinet.form_factor})

**Analysis:**
- Compatibility Score: ${compat.compatibilityScore}%
- Thermal Risk: ${compat.thermalRisk}%
- Bottleneck: ${compat.bottleneckPct}%
${build.bottleneckWarning ? `- Warning: ${build.bottleneckWarning}` : ""}

Structure the report with these sections:
1. Executive Summary
2. Workload Analysis
3. Component Reasoning (why each was chosen)
4. Compatibility Findings
5. Thermal Considerations
6. Upgrade Path Recommendations
7. Final Verdict`
            }
          ],
          systemPrompt: "You are a senior hardware systems engineer. Generate detailed, professional engineering advisory reports. Use markdown formatting with headers, bullet points, and bold text for emphasis. Be specific and technical."
        })
      });
      setReport(data.reply);
    } catch (e) {
      setReport("Failed to generate report. Please try again.");
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-border", children: /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Engineering Advisory Report" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "AI-generated hardware analysis & recommendations" })
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
      /* @__PURE__ */ jsxs(Button, { onClick: generateReport, disabled: loading, children: [
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 mr-2" }),
        "Generate Report"
      ] })
    ] }) }),
    loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "AI is analyzing your configuration and generating the report..." })
    ] }),
    report && !loading && /* @__PURE__ */ jsx(GlassCard, { children: /* @__PURE__ */ jsx("div", { className: "prose prose-invert prose-sm max-w-none", children: /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap text-sm leading-relaxed text-foreground", children: report.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-primary mt-6 mb-3", children: line.slice(2) }, i);
      if (line.startsWith("## ")) return /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-foreground mt-5 mb-2 border-b border-border/30 pb-1", children: line.slice(3) }, i);
      if (line.startsWith("### ")) return /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-foreground mt-4 mb-1", children: line.slice(4) }, i);
      if (line.startsWith("- ") || line.startsWith("* ")) return /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground ml-4 my-0.5", children: [
        "\u2022 ",
        line.slice(2)
      ] }, i);
      if (line.trim() === "") return /* @__PURE__ */ jsx("br", {}, i);
      return /* @__PURE__ */ jsx("p", { className: "text-muted-foreground my-1", children: line }, i);
    }) }) }) }),
    !report && !loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-24 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Select a workload and generate your engineering advisory report" })
    ] })
  ] });
};
var stdin_default = Report;
export {
  stdin_default as default
};
