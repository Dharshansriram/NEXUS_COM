import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, MessageSquare, Layers, FlaskConical, BarChart3, FileText, Users, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
const NAV_ITEMS = [
  { path: "/", label: "Hub", icon: Cpu },
  { path: "/advisor", label: "AI Advisor", icon: MessageSquare },
  { path: "/architect", label: "Architect", icon: Layers },
  { path: "/laboratory", label: "Lab", icon: FlaskConical },
  { path: "/intelligence", label: "Intel", icon: BarChart3 },
  { path: "/report", label: "Report", icon: FileText },
  { path: "/community", label: "Community", icon: Users }
];
const AppShell = ({ children }) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("nav", { className: "sticky top-0 z-50 glass border-b border-border/50", children:
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 flex items-center h-16", children: [
        /* Logo */
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 mr-4 sm:mr-8 flex-shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-border", children: /* @__PURE__ */ jsx(Cpu, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-sm tracking-wider uppercase", children: [
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "NEXUS" }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground ml-1 font-normal text-xs", children: "HW" })
          ] })
        ] }),
        /* Desktop nav links */
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1", children: NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: item.path,
              className: cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                isActive ? "bg-primary/10 text-primary glow-border" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              ),
              children: [
                /* @__PURE__ */ jsx(item.icon, { className: "w-3.5 h-3.5" }),
                item.label
              ]
            },
            item.path
          );
        }) }),
        /* Status indicator - desktop */
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex ml-auto items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-success animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: "ONLINE" })
        ] }),
        /* Mobile right side: status + hamburger */
        /* @__PURE__ */ jsxs("div", { className: "md:hidden ml-auto flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-success animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-muted-foreground font-mono", children: "ONLINE" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setMobileOpen((v) => !v),
              className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all",
              "aria-label": "Toggle navigation",
              children: mobileOpen
                ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
                : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
            }
          )
        ] })
      ] })
    }),

    /* Mobile drawer overlay */
    mobileOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden",
        onClick: () => setMobileOpen(false)
      }
    ),

    /* Mobile slide-in drawer */
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "fixed top-16 left-0 right-0 z-40 glass border-b border-border/50 md:hidden transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        ),
        children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-3 flex flex-col gap-1", children: NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: item.path,
              className: cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary glow-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              ),
              children: [
                /* @__PURE__ */ jsx(item.icon, { className: "w-4 h-4 flex-shrink-0" }),
                item.label
              ]
            },
            item.path
          );
        }) })
      }
    ),

    /* @__PURE__ */ jsx("main", { children })
  ] });
};
var stdin_default = AppShell;
export {
  stdin_default as default
};
