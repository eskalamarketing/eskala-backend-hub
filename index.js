const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Eskala Backend Hub activo ✅");
});

app.get("/meta-sync", (req, res) => {
  res.json({ message: "Meta sync endpoint ready" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
