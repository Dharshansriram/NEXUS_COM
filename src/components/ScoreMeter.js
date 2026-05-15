import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
const COLOR_MAP = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive"
};
const ScoreMeter = ({ label, value, max = 100, color = "primary", size = "md" }) => {
  const pct = Math.min(value / max * 100, 100);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: cn("font-medium text-muted-foreground", size === "sm" ? "text-[10px]" : "text-xs"), children: label }),
      /* @__PURE__ */ jsx("span", { className: cn("font-mono font-bold", size === "sm" ? "text-[10px]" : "text-xs"), children: Math.round(value) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: cn("w-full rounded-full bg-secondary overflow-hidden", size === "sm" ? "h-1" : "h-1.5"), children: /* @__PURE__ */ jsx(
      "div",
      {
        className: cn("h-full rounded-full transition-all duration-700", COLOR_MAP[color]),
        style: { width: `${pct}%` }
      }
    ) })
  ] });
};
var stdin_default = ScoreMeter;
export {
  stdin_default as default
};
