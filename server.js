const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname));

app.get("/api/google", require("./api/google.js"));
app.get("/api/youtube", require("./api/youtube.js"));
app.get("/api/wiki", require("./api/wiki.js"));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
