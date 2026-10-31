const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API handlers
const youtube = require('./api/youtube');
const wiki = require('./api/wiki');
const google = require('./api/tavily');

// API routes
app.all('/api/youtube', async (req, res, next) => {
  try {
    await youtube(req, res);
  } catch (err) {
    next(err);
  }
});

app.all('/api/wiki', async (req, res, next) => {
  try {
    await wiki(req, res);
  } catch (err) {
    next(err);
  }
});

app.all('/api/google', async (req, res, next) => {
  try {
    await google(req, res);
  } catch (err) {
    next(err);
  }
});

// Static website
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
