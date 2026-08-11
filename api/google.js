import cheerio from "cheerio";

export default async function handler(req, res) {
  const q = req.query.q;
  const url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const results = [];

  $(".tF2Cxc").each((i, el) => {
    results.push({
      title: $(el).find("h3").text(),
      link: $(el).find("a").attr("href"),
      snippet: $(el).find(".VwiC3b").text()
    });
  });

  res.status(200).json(results);
}
