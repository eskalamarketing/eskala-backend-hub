import express from "express";

const app = express();
app.use(express.json());

// 1) Salud (para comprobar que Railway está vivo)
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "eskala-backend-hub", ts: new Date().toISOString() });
});

// 2) Endpoint de prueba para confirmar que tu Backend Hub responde
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

// (Luego aquí pondremos /meta/insights y /capi/event, etc.)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
