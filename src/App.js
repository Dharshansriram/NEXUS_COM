import { jsx, jsxs } from "react/jsx-runtime";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppShell from "@/components/AppShell";
import Index from "./pages/Index";
import Advisor from "./pages/Advisor";
import Architect from "./pages/Architect";
import Laboratory from "./pages/Laboratory";
import Intelligence from "./pages/Intelligence";
import Report from "./pages/Report";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = () => /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
  /* @__PURE__ */ jsx(Toaster, {}),
  /* @__PURE__ */ jsx(Sonner, {}),
  /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Index, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/advisor", element: /* @__PURE__ */ jsx(Advisor, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/architect", element: /* @__PURE__ */ jsx(Architect, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/laboratory", element: /* @__PURE__ */ jsx(Laboratory, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/intelligence", element: /* @__PURE__ */ jsx(Intelligence, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/report", element: /* @__PURE__ */ jsx(Report, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/community", element: /* @__PURE__ */ jsx(Community, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/auth", element: /* @__PURE__ */ jsx(Auth, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
  ] }) }) })
] }) }) });
var stdin_default = App;
export {
  stdin_default as default
};
