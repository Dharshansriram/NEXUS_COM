import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
const STARTER_PROMPTS = [
  "I develop AI models and edit 4K video",
  "I'm a competitive gamer who also streams",
  "I need a silent workstation for software development",
  "I do 3D rendering and CAD design work"
];
const Advisor = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to NEXUS Hardware Intelligence. Describe your workload, and I'll engineer the optimal hardware architecture for you.\n\nTell me: **What do you use your computer for?** Be as detailed as you like \u2014 I'll ask follow-up questions to refine your requirement profile."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const data = await apiFetch("/api/ai-chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages })
      });
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I encountered an issue processing your request. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-[calc(100vh-4rem)] flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 pt-6 pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-border", children: /* @__PURE__ */ jsx(Bot, { className: "w-4 h-4 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold", children: "AI Hardware Advisor" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Describe your workload \u2014 I'll engineer the solution" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4 scrollbar-hide", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-3xl space-y-4", children: [
      messages.map((m, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex gap-3 animate-slide-up ${m.role === "user" ? "justify-end" : ""}`,
          style: { animationDelay: `${i * 0.05}s` },
          children: [
            m.role === "assistant" && /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1", children: /* @__PURE__ */ jsx(Bot, { className: "w-3.5 h-3.5 text-primary" }) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "glass-strong"}`,
                children: m.content
              }
            ),
            m.role === "user" && /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1", children: /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-muted-foreground" }) })
          ]
        },
        i
      )),
      loading && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 animate-slide-up", children: [
        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1", children: /* @__PURE__ */ jsx(Bot, { className: "w-3.5 h-3.5 text-primary" }) }),
        /* @__PURE__ */ jsx("div", { className: "glass-strong rounded-xl px-4 py-3", children: /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-primary" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: endRef })
    ] }) }),
    messages.length <= 1 && /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-3xl px-4 pb-3", children: /* @__PURE__ */ jsx("div", { className: "starter-prompts-grid grid grid-cols-1 sm:grid-cols-2 gap-2", children: STARTER_PROMPTS.map((p, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => sendMessage(p),
        className: "text-xs px-3 py-2 rounded-lg glass hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5",
        children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-primary" }),
          p
        ]
      },
      i
    )) }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-border/50 glass", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-3xl px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-end", children: [
      /* @__PURE__ */ jsx(
        Textarea,
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: "Describe your workload...",
          className: "min-h-[44px] max-h-[120px] resize-none bg-secondary/50 border-border/50 text-sm",
          rows: 1
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "icon",
          onClick: () => sendMessage(),
          disabled: !input.trim() || loading,
          className: "flex-shrink-0 h-11 w-11",
          children: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })
        }
      )
    ] }) }) })
  ] });
};
var stdin_default = Advisor;
export {
  stdin_default as default
};
