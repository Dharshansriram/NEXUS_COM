import { jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
const GlassCard = ({ children, className, glow, hover, onClick }) => /* @__PURE__ */ jsx(
  "div",
  {
    onClick,
    className: cn(
      "glass-strong rounded-xl p-5 transition-all duration-300",
      glow && "glow-border",
      hover && "cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01]",
      onClick && "cursor-pointer",
      className
    ),
    children
  }
);
var stdin_default = GlassCard;
export {
  stdin_default as default
};
