import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Plus, Send, User, Clock, Tag, ChevronDown, ChevronUp, LogIn, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
const CATEGORIES = [
  { value: "general", label: "General Discussion" },
  { value: "build-share", label: "Build Share" },
  { value: "help", label: "Help & Support" },
  { value: "review", label: "Component Review" },
  { value: "upgrade", label: "Upgrade Path" },
  { value: "thermal", label: "Thermal & Cooling" }
];
const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newTags, setNewTags] = useState("");
  const [newComment, setNewComment] = useState({});
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/community/posts");
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(data);
    } catch {
    }
  }, []);
  useEffect(() => {
    void fetchPosts();
    const id = window.setInterval(() => void fetchPosts(), 12e3);
    return () => window.clearInterval(id);
  }, [fetchPosts]);
  const fetchComments = async (postId) => {
    try {
      const list = await apiFetch(`/api/community/posts/${encodeURIComponent(postId)}/comments`);
      setComments((prev) => ({ ...prev, [postId]: list }));
    } catch {
      toast({ title: "Error", description: "Could not load comments.", variant: "destructive" });
    }
  };
  const togglePost = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!comments[postId]) void fetchComments(postId);
    }
  };
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/auth");
    if (!newTitle.trim() || !newContent.trim()) return;
    setLoading(true);
    try {
      await apiFetch("/api/community/posts", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          tags: newTags.split(",").map((t) => t.trim()).filter(Boolean)
        })
      });
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setShowNewPost(false);
      toast({ title: "Thread created" });
      await fetchPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create post";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setLoading(false);
  };
  const handleAddComment = async (postId) => {
    if (!user) return navigate("/auth");
    const text = newComment[postId]?.trim();
    if (!text) return;
    try {
      await apiFetch(`/api/community/posts/${encodeURIComponent(postId)}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: text })
      });
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      await fetchComments(postId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not add comment";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };
  const handleDeletePost = async (postId) => {
    try {
      await apiFetch(`/api/community/posts/${encodeURIComponent(postId)}`, { method: "DELETE" });
      await fetchPosts();
    } catch {
      toast({ title: "Error", description: "Could not delete post.", variant: "destructive" });
    }
  };
  const filtered = filterCategory === "all" ? posts : posts.filter((p) => p.category === filterCategory);
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-primary", children: "Community Hardware Lab" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Share builds, discuss hardware, get expert feedback" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: user ? /* @__PURE__ */ jsxs(Button, { onClick: () => setShowNewPost(!showNewPost), size: "sm", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
        " New Thread"
      ] }) : /* @__PURE__ */ jsxs(Button, { onClick: () => navigate("/auth"), variant: "outline", size: "sm", children: [
        /* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4 mr-1" }),
        " Sign In to Post"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-6 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        Badge,
        {
          variant: filterCategory === "all" ? "default" : "outline",
          className: "cursor-pointer",
          onClick: () => setFilterCategory("all"),
          children: "All"
        }
      ),
      CATEGORIES.map((c) => /* @__PURE__ */ jsx(
        Badge,
        {
          variant: filterCategory === c.value ? "default" : "outline",
          className: "cursor-pointer",
          onClick: () => setFilterCategory(c.value),
          children: c.label
        },
        c.value
      ))
    ] }),
    showNewPost && /* @__PURE__ */ jsx(GlassCard, { glow: true, className: "mb-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleCreatePost, className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Create New Thread" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Title" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: newTitle,
            onChange: (e) => setNewTitle(e.target.value),
            placeholder: "Thread title\u2026",
            className: "bg-secondary/50 border-border/50",
            maxLength: 200,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Category" }),
          /* @__PURE__ */ jsxs(Select, { value: newCategory, onValueChange: setNewCategory, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-secondary/50 border-border/50", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.value, children: c.label }, c.value)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Tags (comma separated)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: newTags,
              onChange: (e) => setNewTags(e.target.value),
              placeholder: "gaming, rtx, amd",
              className: "bg-secondary/50 border-border/50",
              maxLength: 200
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Content" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            value: newContent,
            onChange: (e) => setNewContent(e.target.value),
            placeholder: "Share your build, ask questions, review components\u2026",
            className: "bg-secondary/50 border-border/50 min-h-[120px]",
            maxLength: 5e3,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setShowNewPost(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", size: "sm", disabled: loading, children: loading ? "Posting\u2026" : "Post Thread" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      filtered.length === 0 && /* @__PURE__ */ jsxs(GlassCard, { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No threads yet. Start the conversation!" })
      ] }),
      filtered.map((post) => /* @__PURE__ */ jsxs(GlassCard, { hover: true, className: "space-y-3", onClick: () => togglePost(post.id), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: CATEGORIES.find((c) => c.value === post.category)?.label || post.category }),
              post.tags?.map((tag) => /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
                /* @__PURE__ */ jsx(Tag, { className: "w-2.5 h-2.5 mr-0.5" }),
                tag
              ] }, tag))
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground truncate", children: post.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(User, { className: "w-3 h-3" }),
                post.profiles?.username || "Unknown"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "w-3 h-3" }),
                comments[post.id]?.length ?? "\u2026"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            user?.id === post.user_id && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-destructive/70 hover:text-destructive",
                onClick: (e) => {
                  e.stopPropagation();
                  void handleDeletePost(post.id);
                },
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            ),
            expandedPost === post.id ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
          ] })
        ] }),
        expandedPost === post.id && /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border/30 space-y-4", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/80 whitespace-pre-wrap", children: post.content }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Comments" }),
            (comments[post.id] || []).map((comment) => /* @__PURE__ */ jsxs("div", { className: "glass rounded-lg p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground", children: comment.profiles?.username || "Unknown" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/80", children: comment.content })
            ] }, comment.id)),
            user ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: newComment[post.id] || "",
                  onChange: (e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value })),
                  placeholder: "Add a comment\u2026",
                  className: "bg-secondary/50 border-border/50 text-sm",
                  maxLength: 2e3,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleAddComment(post.id);
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => void handleAddComment(post.id), children: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }) })
            ] }) : /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => navigate("/auth"), children: [
              /* @__PURE__ */ jsx(LogIn, { className: "w-3.5 h-3.5 mr-1" }),
              " Sign in to comment"
            ] })
          ] })
        ] })
      ] }, post.id))
    ] })
  ] });
};
var stdin_default = Community;
export {
  stdin_default as default
};
