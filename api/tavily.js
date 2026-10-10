module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();

  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "q is required" });

  const key = process.env.TAVILY_API_KEY;
  if (!key) return res.status(500).json({ error: "TAVILY_API_KEY is not set" });

  try {
    const r = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: q,
        max_results: 10,
        search_depth: "basic",
      }),
    });
    const data = await r.json();

    if (!r.ok) return res.status(r.status).json({ error: data });

    const items = (data.results || []).map((i) => ({
      title: i.title,
      link: i.url,
      snippet: i.content,
      displayLink: new URL(i.url).hostname,
    }));

    res.status(200).json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
