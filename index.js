import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.status(200).send("OK - Eskala Backend Hub");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "eskala-backend-hub" });
});

// 1) INSIGHTS (manual)
app.get("/meta/insights", async (req, res) => {
  try {
    const adAccountId = process.env.META_AD_ACCOUNT_ID; // sin "act_" o con "act_" (te explico abajo)
    const token = process.env.META_ACCESS_TOKEN;

    const level = req.query.level || "campaign"; // campaign | adset | ad
    const date_preset = req.query.date_preset || "last_7d";
    const fields = req.query.fields || "spend,impressions,clicks,ctr,cpc";

    // Normalizamos: Meta suele usar act_<ID>
    const actId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;

    const url = `https://graph.facebook.com/v25.0/${actId}/insights?level=${level}&date_preset=${date_preset}&fields=${encodeURIComponent(fields)}&access_token=${token}`;

    const r = await fetch(url);
    const data = await r.json();
    res.json({ ok: true, url, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 2) SYNC diario (para cron)
app.get("/sync/daily", async (req, res) => {
  try {
    // aquí luego guardaremos en BD; por ahora solo consulta last_1d / yesterday
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const token = process.env.META_ACCESS_TOKEN;
    const actId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;

    const url = `https://graph.facebook.com/v25.0/${actId}/insights?date_preset=yesterday&level=campaign&fields=campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc&access_token=${token}`;

    const r = await fetch(url);
    const data = await r.json();

    // TODO: guardar en BD (fase siguiente)
    res.json({ ok: true, ran: "daily-sync", data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => console.log("Server listening on", PORT));
