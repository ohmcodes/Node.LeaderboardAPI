const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// POST /score - post id and score
app.post('/score', async (req, res) => {
  const { id, score } = req.body;
  if (!id || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid id or score' });
  }
  try {
    const entry = await prisma.leaderboard.upsert({
      where: { id },
      update: { score },
      create: { id, score }
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /score/:id - get score by id
app.get('/score/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await prisma.leaderboard.findUnique({
      where: { id }
    });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /top10 - get top 10
app.get('/top10', async (req, res) => {
  try {
    const top10 = await prisma.leaderboard.findMany({
      orderBy: { score: 'desc' },
      take: 10
    });
    res.json(top10);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});