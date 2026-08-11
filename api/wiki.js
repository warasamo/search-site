export default async function handler(req, res) {
  const q = req.query.q;

  const url = `https://ja.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(q)}`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
}
