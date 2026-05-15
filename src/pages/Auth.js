import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast({ title: "Welcome back", description: "Signed in successfully." });
        navigate("/community");
      } else {
        if (!username.trim()) {
          toast({ title: "Username required", variant: "destructive" });
          setLoading(false);
          return;
        }
        await register(email, password, username.trim());
        toast({ title: "Account created", description: "You're signed in." });
        navigate("/community");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12 max-w-md", children: [
    /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "mb-6 text-muted-foreground", onClick: () => navigate(-1), children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
      " Back"
    ] }),
    /* @__PURE__ */ jsxs(GlassCard, { glow: true, children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-primary", children: isLogin ? "Sign In" : "Create Account" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: isLogin ? "Access the Community Hardware Lab" : "Join the hardware engineering community" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        !isLogin && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "username", className: "text-xs text-muted-foreground", children: "Username" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "username",
              value: username,
              onChange: (e) => setUsername(e.target.value),
              placeholder: "hardwareengineer42",
              className: "bg-secondary/50 border-border/50",
              maxLength: 50
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-xs text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@example.com",
              className: "bg-secondary/50 border-border/50",
              required: true,
              maxLength: 255
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-xs text-muted-foreground", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              className: "bg-secondary/50 border-border/50",
              required: true,
              minLength: 6,
              maxLength: 100
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Processing\u2026" : isLogin ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4 mr-2" }),
          " Sign In"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4 mr-2" }),
          " Create Account"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setIsLogin(!isLogin),
          className: "text-xs text-primary hover:underline",
          children: isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"
        }
      ) })
    ] })
  ] });
};
var stdin_default = Auth;
export {
  stdin_default as default
};
