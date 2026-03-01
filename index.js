import express from "express";

const app = express();
app.use(express.json());

// Página raíz (para que no salga "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Eskala Backend Hub ✅");
});

// Salud (para probar Railway)
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "eskala-backend-hub", ts: new Date().toISOString() });
});

// Ping (para probar API)
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
