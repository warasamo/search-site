module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const q = req.query.q;
  const start = req.query.start || 1;

  if (!q) {
    return res.status(400).json({ error: "q is required" });
  }

  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  if (!key || !cx) {
    return res.status(500).json({ error: "GOOGLE_API_KEY or GOOGLE_CX is not set" });
  }

  const url =
    "https://www.googleapis.com/customsearch/v1" +
    "?key=" + encodeURIComponent(key) +
    "&cx=" + encodeURIComponent(cx) +
    "&q=" + encodeURIComponent(q) +
    "&start=" + encodeURIComponent(start);

  try {
    const r = await fetch(url);
    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({ error: data.error || "Google API error" });
    }

    const items = (data.items || []).map((i) => ({
      title: i.title,
      link: i.link,
      snippet: i.snippet,
      displayLink: i.displayLink,
    }));

    res.status(200).json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
