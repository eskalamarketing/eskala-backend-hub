import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("OK - Eskala Backend Hub");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "eskala-backend-hub" });
});

app.get("/meta/insights", async (req, res) => {
  try {
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const token = process.env.META_ACCESS_TOKEN;

    if (!adAccountId || !token) {
      return res.status(400).json({
        ok: false,
        error: "Faltan variables META_AD_ACCOUNT_ID o META_ACCESS_TOKEN en Railway",
      });
    }

    const level = req.query.level || "campaign"; // campaign | adset | ad
    const date_preset = req.query.date_preset || "last_7d";
    const fields = req.query.fields || "spend,impressions,clicks,ctr,cpc";

    const actId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;

    const url =
      `https://graph.facebook.com/v25.0/${actId}/insights` +
      `?level=${encodeURIComponent(level)}` +
      `&date_preset=${encodeURIComponent(date_preset)}` +
      `&fields=${encodeURIComponent(fields)}` +
      `&access_token=${encodeURIComponent(token)}`;

    const r = await fetch(url);
    const data = await r.json();

    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/sync/daily", async (req, res) => {
  try {
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const token = process.env.META_ACCESS_TOKEN;

    if (!adAccountId || !token) {
      return res.status(400).json({
        ok: false,
        error: "Faltan variables META_AD_ACCOUNT_ID o META_ACCESS_TOKEN en Railway",
      });
    }

    const actId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;

    const url =
      `https://graph.facebook.com/v25.0/${actId}/insights` +
      `?date_preset=yesterday` +
      `&level=campaign` +
      `&fields=${encodeURIComponent("campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc")}` +
      `&access_token=${encodeURIComponent(token)}`;

    const r = await fetch(url);
    const data = await r.json();

    res.json({ ok: true, ran: "daily-sync", data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => console.log("Server listening on", PORT));
