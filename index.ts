// supabase/functions/scan-flyer/index.ts
//
// Edge Function that proxies flyer scans to the Anthropic API.
// The Anthropic key lives here as a server-side secret and NEVER reaches the browser.
// Only signed-in staff can call this — anonymous/youth requests are rejected.

import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── Gate 1: require a real signed-in user (blocks anonymous token-burning) ──
    const authHeader = req.headers.get("Authorization") || "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return json({ error: "Unauthorized — staff sign-in required." }, 401);
    }

    // ── Parse request ──
    const { image, categoryList } = await req.json();
    if (!image) return json({ error: "Missing image data." }, 400);

    const prompt = `You are a case manager assistant. Analyze this resource flyer and extract key info.

LANGUAGE RULE: Detect the primary language of the flyer. Write all text fields (name, summary, eligibility, hours, services, notes) in that same language. If the flyer is in Spanish, respond in Spanish. If it is in English, respond in English. And so on for any other language.
EXCEPTION: "category" must always be one of the English category IDs listed below — never translated.

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "name": "Organization or program name — in the flyer's language",
  "category": one of [${categoryList || ""}],
  "summary": "2-3 sentence summary — in the flyer's language",
  "phone": "phone number or null",
  "address": "address or null",
  "website": "website URL or null",
  "email": "email or null",
  "hours": "hours of operation or null — in the flyer's language",
  "eligibility": "who qualifies or null — in the flyer's language",
  "services": ["list", "of", "key", "services", "in the flyer's language"],
  "notes": "any other important info or null — in the flyer's language",
  "is_recurring": true or false — true if this is a recurring/ongoing event (e.g. weekly, monthly, every Tuesday),
  "date_display": "Human-readable date label. Rules: (1) Single one-time event: 'Mon Jun 12, 2025 at 2:00 PM' (2) Recurring event: list specific dates+times if shown, e.g. 'Every Tuesday at 10am' or 'Jun 5, Jun 12, Jun 19 at 9am' (3) Deadline/signup window with no event date yet: 'before June 2025' or 'by May 30' (4) Date range: 'Jun 1-15, 2025' (5) No date at all: null",
  "expiry_date": "YYYY-MM-DD — the LAST or ONLY event/end date for auto-cleanup purposes. IMPORTANT: if is_recurring is true, this MUST be null — never set a date on a recurring event. For 'before Month' deadlines use the last day of that month. For date ranges use the end date. Null if no date found."
}`;

    // ── Call Anthropic ──
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1200,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    const data = await anthropicRes.json();
    if (data.error) {
      return json({ error: data.error.message || data.error.type || "Anthropic API error" }, 502);
    }

    const text = (data.content || []).map((b: { text?: string }) => b.text || "").join("");
    return json({ text });

  } catch (e) {
    return json({ error: (e as Error).message || String(e) }, 500);
  }
});
