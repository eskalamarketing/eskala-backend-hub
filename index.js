import express from "express";

const app = express();
app.use(express.json());

// 1) Healthcheck: prueba rápida
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "eskala-backend-hub", time: new Date().toISOString() });
});

// Helpers
function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// 2) Proxy SOLO LECTURA a Meta Insights
// Uso:
// GET /meta/insights?ad_account_id=act_123&date_preset=last_7d&level=campaign&fields=spend,impressions,clicks
app.get("/meta/insights", async (req, res) => {
  try {
    const META_ACCESS_TOKEN = requireEnv("META_ACCESS_TOKEN");

    const adAccountId = req.query.ad_account_id; // ej: act_1480...
    if (!adAccountId) return res.status(400).json({ error: "Missing ad_account_id" });

    const datePreset = req.query.date_preset || "last_7d"; // last_7d, last_30d, maximum...
    const level = req.query.level || "campaign"; // campaign | adset | ad
    const fields = req.query.fields || "spend,impressions,clicks,ctr,cpc";

    // Endpoint Meta
    const url = new URL(`https://graph.facebook.com/v25.0/${adAccountId}/insights`);
    url.searchParams.set("access_token", META_ACCESS_TOKEN);
    url.searchParams.set("date_preset", datePreset);
    url.searchParams.set("level", level);
    url.searchParams.set("fields", fields);

    const r = await fetch(url.toString());
    const data = await r.json();

    if (!r.ok) return res.status(r.status).json(data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
