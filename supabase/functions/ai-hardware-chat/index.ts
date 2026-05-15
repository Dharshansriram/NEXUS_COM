import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are NEXUS, a senior hardware systems engineer and AI hardware advisor. You help users find the optimal PC hardware configuration for their specific workloads.

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { messages, systemPrompt } = await req.json();

    const apiMessages = [
      { role: "system", content: systemPrompt || SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: apiMessages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", errText);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
