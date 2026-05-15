import { Router } from "express";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "./db/mongodb.js";
import { toClientDoc, toClientDocs } from "./db/serialize.js";
import { authMiddleware, getJwtSecret } from "./middleware/auth.js";

const COMPONENT_COLLECTIONS = new Set([
  "cpus",
  "gpus",
  "motherboards",
  "ram",
  "storage",
  "psus",
  "cooling",
  "cabinets",
]);

const AI_SYSTEM_DEFAULT = `You are NEXUS, a senior hardware systems engineer and AI hardware advisor. You help users find the optimal PC hardware configuration for their specific workloads.

Your expertise includes:
- Performance engineering and benchmarking
- Hardware compatibility analysis (CPU sockets, chipsets, RAM generations)
- Thermal design and cooling solutions
- Power efficiency optimization
- Upgrade path planning

When users describe their workload:
1. Ask 2-3 focused follow-up questions about their specific needs (dataset sizes, resolution, multitasking habits, future plans)
2. Once you have enough info, generate a Requirement Profile summarizing their needs
3. Recommend specific hardware strategies with reasoning

Be technical but accessible. Use concrete numbers and specifications. Never focus on prices — focus on performance, compatibility, and engineering quality.

Format your responses with clear structure using markdown. Keep responses focused and actionable.`;

function signUserToken(userDoc) {
  const sub = userDoc._id.toString();
  return jwt.sign(
    { sub, email: userDoc.email, username: userDoc.username },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

function publicUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    username: userDoc.username,
  };
}

function formatPost(p) {
  return {
    id: p._id.toString(),
    user_id: p.userId,
    title: p.title,
    content: p.content,
    category: p.category,
    tags: p.tags || [],
    build_config: p.build_config ?? null,
    created_at: (p.createdAt || new Date()).toISOString(),
    profiles: {
      id: p.userId,
      username: p.authorUsername || "Member",
      expert_tags: p.authorExpertTags || [],
    },
  };
}

function formatComment(c) {
  return {
    id: c._id.toString(),
    post_id: c.postId,
    user_id: c.userId,
    content: c.content,
    created_at: (c.createdAt || new Date()).toISOString(),
    profiles: {
      id: c.userId,
      username: c.authorUsername || "Member",
      expert_tags: [],
    },
  };
}

async function runAiChat(messages, systemPrompt) {
  const sys = systemPrompt || AI_SYSTEM_DEFAULT;
  const apiMessages = [{ role: "system", content: sys }, ...messages.map((m) => ({ role: m.role, content: m.content }))];

  if (process.env.OPENAI_API_KEY) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: apiMessages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`OpenAI: ${r.status} ${t}`);
    }
    const data = await r.json();
    return data.choices?.[0]?.message?.content || "No response from model.";
  }

  if (process.env.LOVABLE_API_KEY) {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: apiMessages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`AI gateway: ${r.status} ${t}`);
    }
    const data = await r.json();
    return data.choices?.[0]?.message?.content || "No response from model.";
  }

  return `*(AI is not configured.)* Add **OPENAI_API_KEY** (recommended) or **LOVABLE_API_KEY** to your server \`.env\` file, restart the API, and try again.

For now, here is a quick checklist based on your last message:
- Confirm workload (gaming, dev, AI, content creation).
- Set RAM generation to match the CPU memory controller.
- Match motherboard socket and chipset to the CPU.
- Size PSU at roughly CPU TDP + GPU power + ~150W headroom.`;
}

export function createApiRouter() {
  const router = Router();

  router.get("/health", async (_req, res) => {
    try {
      const db = await getDb();
      await db.command({ ping: 1 });
      res.json({ ok: true, mongodb: true });
    } catch (e) {
      res.status(503).json({
        ok: false,
        mongodb: false,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  });

  router.get("/catalog", async (_req, res) => {
    try {
      const db = await getDb();
      const [cpus, gpus, motherboards, ramRows, storageRows, psus, coolingRows, cabinets] = await Promise.all([
        db.collection("cpus").find().toArray(),
        db.collection("gpus").find().toArray(),
        db.collection("motherboards").find().toArray(),
        db.collection("ram").find().toArray(),
        db.collection("storage").find().toArray(),
        db.collection("psus").find().toArray(),
        db.collection("cooling").find().toArray(),
        db.collection("cabinets").find().toArray(),
      ]);
      res.json({
        cpus: toClientDocs(cpus),
        gpus: toClientDocs(gpus),
        motherboards: toClientDocs(motherboards),
        rams: toClientDocs(ramRows),
        storages: toClientDocs(storageRows),
        psus: toClientDocs(psus),
        coolings: toClientDocs(coolingRows),
        cabinets: toClientDocs(cabinets),
      });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.get("/components/:category", async (req, res) => {
    const { category } = req.params;
    if (!COMPONENT_COLLECTIONS.has(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    try {
      const db = await getDb();
      const docs = await db.collection(category).find().toArray();
      res.json(toClientDocs(docs));
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.post("/auth/register", async (req, res) => {
    try {
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();
      const password = String(req.body?.password || "");
      const username = String(req.body?.username || "").trim();
      if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: "Valid email and password (min 6 chars) required" });
      }
      if (!username || username.length < 2) {
        return res.status(400).json({ error: "Username required (min 2 chars)" });
      }
      const db = await getDb();
      const passwordHash = await bcrypt.hash(password, 10);
      const now = new Date();
      let result;
      try {
        result = await db.collection("users").insertOne({
          email,
          passwordHash,
          username,
          expert_tags: [],
          createdAt: now,
        });
      } catch (e) {
        if (e && e.code === 11000) return res.status(409).json({ error: "Email already registered" });
        throw e;
      }
      const userDoc = await db.collection("users").findOne({ _id: result.insertedId });
      const token = signUserToken(userDoc);
      res.json({ token, user: publicUser(userDoc) });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.post("/auth/login", async (req, res) => {
    try {
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();
      const password = String(req.body?.password || "");
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });
      const db = await getDb();
      const userDoc = await db.collection("users").findOne({ email });
      if (!userDoc || !(await bcrypt.compare(password, userDoc.passwordHash))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = signUserToken(userDoc);
      res.json({ token, user: publicUser(userDoc) });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.get("/auth/me", authMiddleware(false), async (req, res) => {
    if (!req.user) return res.json({ user: null });
    try {
      const db = await getDb();
      const userDoc = await db.collection("users").findOne(
        { _id: new ObjectId(req.user.sub) },
        { projection: { passwordHash: 0 } },
      );
      if (!userDoc) return res.json({ user: null });
      res.json({ user: publicUser(userDoc) });
    } catch {
      res.json({ user: null });
    }
  });

  router.get("/community/posts", async (_req, res) => {
    try {
      const db = await getDb();
      const posts = await db.collection("community_posts").find().sort({ createdAt: -1 }).toArray();
      res.json(posts.map(formatPost));
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.get("/community/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid post id" });
    try {
      const db = await getDb();
      const list = await db
        .collection("community_comments")
        .find({ postId })
        .sort({ createdAt: 1 })
        .toArray();
      res.json(list.map(formatComment));
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.post("/community/posts", authMiddleware(true), async (req, res) => {
    try {
      const title = String(req.body?.title || "").trim();
      const content = String(req.body?.content || "").trim();
      const category = String(req.body?.category || "general").trim();
      const tags = Array.isArray(req.body?.tags) ? req.body.tags.map(String) : [];
      if (!title || !content) return res.status(400).json({ error: "Title and content required" });
      const db = await getDb();
      const now = new Date();
      const doc = {
        userId: req.user.sub,
        authorUsername: req.user.username,
        authorExpertTags: [],
        title,
        content,
        category,
        tags,
        build_config: req.body?.build_config ?? null,
        createdAt: now,
        updatedAt: now,
      };
      const r = await db.collection("community_posts").insertOne(doc);
      const created = await db.collection("community_posts").findOne({ _id: r.insertedId });
      res.json(formatPost(created));
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.post("/community/posts/:postId/comments", authMiddleware(true), async (req, res) => {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid post id" });
    const text = String(req.body?.content || "").trim();
    if (!text) return res.status(400).json({ error: "Content required" });
    try {
      const db = await getDb();
      const post = await db.collection("community_posts").findOne({ _id: new ObjectId(postId) });
      if (!post) return res.status(404).json({ error: "Post not found" });
      const now = new Date();
      const doc = {
        postId,
        userId: req.user.sub,
        authorUsername: req.user.username,
        content: text,
        createdAt: now,
      };
      const r = await db.collection("community_comments").insertOne(doc);
      const created = await db.collection("community_comments").findOne({ _id: r.insertedId });
      res.json(formatComment(created));
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.delete("/community/posts/:postId", authMiddleware(true), async (req, res) => {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid post id" });
    try {
      const db = await getDb();
      const _id = new ObjectId(postId);
      const post = await db.collection("community_posts").findOne({ _id });
      if (!post) return res.status(404).json({ error: "Not found" });
      if (post.userId !== req.user.sub) return res.status(403).json({ error: "Forbidden" });
      await db.collection("community_comments").deleteMany({ postId });
      await db.collection("community_posts").deleteOne({ _id });
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  router.post("/ai-chat", async (req, res) => {
    try {
      const messages = req.body?.messages;
      const systemPrompt = req.body?.systemPrompt;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "messages[] required" });
      }
      const reply = await runAiChat(messages, systemPrompt);
      res.json({ reply });
    } catch (e) {
      res.status(500).json({
        error: "AI request failed",
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  });

  return router;
}
