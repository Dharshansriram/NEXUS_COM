import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Layers, FlaskConical, BarChart3, FileText, Cpu, ArrowRight, Shield, Thermometer, Battery } from "lucide-react";
import GlassCard from "@/components/GlassCard";
const FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Hardware Advisor",
    desc: "Describe your workload. Our AI asks intelligent follow-ups and generates a full requirement profile.",
    path: "/advisor",
    iconWrap: "bg-primary/15 text-primary"
  },
  {
    icon: Layers,
    title: "Architecture Engine",
    desc: "Get multiple hardware strategies: performance, efficiency, thermal, silent, and upgrade-friendly stacks.",
    path: "/architect",
    iconWrap: "bg-accent/15 text-accent"
  },
  {
    icon: FlaskConical,
    title: "Comparison Laboratory",
    desc: "Side-by-side analysis with radar charts, efficiency ratios, and workload suitability scores.",
    path: "/laboratory",
    iconWrap: "bg-success/15 text-success"
  },
  {
    icon: BarChart3,
    title: "Compatibility Intelligence",
    desc: "Deep compatibility analysis: socket matching, thermal risk, bottleneck detection with percentages.",
    path: "/intelligence",
    iconWrap: "bg-warning/15 text-warning"
  },
  {
    icon: FileText,
    title: "Engineering Report",
    desc: "Generate comprehensive hardware advisory reports with AI analysis and upgrade paths.",
    path: "/report",
    iconWrap: "bg-info/15 text-info"
  }
];
const STATS = [
  { icon: Cpu, label: "Components", value: "150+" },
  { icon: Shield, label: "Compatibility Checks", value: "12" },
  { icon: Thermometer, label: "Thermal Profiles", value: "5" },
  { icon: Battery, label: "Power Configs", value: "8" }
];
const Index = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden hero-section", children: /* @__PURE__ */ jsxs("div", { className: "relative container mx-auto px-4 pt-12 sm:pt-20 pb-10 sm:pb-16 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono text-primary mb-8 glow-border", children: [
        /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
        "INTELLIGENT HARDWARE ADVISORY PLATFORM"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-primary", children: "NEXUS" }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-foreground/80 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide", children: "Hardware Intelligence" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed", children: [
        "Performance engineering. Compatibility intelligence. Upgrade path planning.",
        /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
        "Not a store \u2014 an engineering advisory system."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center mb-10 sm:mb-16 px-2 sm:px-0", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => navigate("/advisor"),
            className: "group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]",
            children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4" }),
              "Start AI Consultation",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => navigate("/architect"),
            className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass text-foreground font-semibold text-sm transition-all hover:bg-secondary/50 glow-border",
            children: [
              /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" }),
              "Build Architecture"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto", children: STATS.map((s, i) => /* @__PURE__ */ jsxs(GlassCard, { className: "text-center py-4 px-3", children: [
        /* @__PURE__ */ jsx(s.icon, { className: "w-5 h-5 text-primary mx-auto mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold font-mono text-primary", children: s.value }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground uppercase tracking-wider mt-1", children: s.label })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-primary uppercase tracking-widest", children: "Platform Capabilities" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mt-2", children: "Engineering-Grade Intelligence" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: FEATURES.map((f, i) => /* @__PURE__ */ jsxs(
        GlassCard,
        {
          hover: true,
          onClick: () => navigate(f.path),
          className: "group",
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-lg ${f.iconWrap} flex items-center justify-center mb-4`, children: /* @__PURE__ */ jsx(f.icon, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-2", children: f.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: f.desc }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-4 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity", children: [
              "Enter ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8 border-t border-border/30", children: /* @__PURE__ */ jsxs("div", { className: "footer-row flex items-center justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono", children: "NEXUS HW v2.0" }),
      /* @__PURE__ */ jsx("span", { children: "Intelligent Hardware Advisory" })
    ] }) })
  ] });
};
var stdin_default = Index;
export {
  stdin_default as default
};
