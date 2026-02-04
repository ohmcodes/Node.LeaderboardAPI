const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const randomNames = [
  'JumpMaster', 'CoinCollector', 'PlatformHero', 'LevelJumper', 'StarSeeker', 'PipeSurfer', 'BlockBuster', 'FlagGetter', 'MushroomMage', 'FireFlower',
  'SuperRunner', 'CloudLeaper', 'CastleConqueror', 'KoopaKiller', 'YoshiRider', 'WarpWhiz', 'PowerUpPro', 'ShellShocker', 'BowserBeater', 'PrincessSaver',
  'AdventureAce', 'QuestQuasher', 'DungeonDiver', 'TreasureHunter', 'GemGrabber', 'KeyKeeper', 'DoorDasher', 'SecretSeeker', 'BossBuster', 'FinalFighter',
  'SpeedSprinter', 'AgileJumper', 'GravityGuru', 'BounceBuddy', 'SwingMaster', 'ClimbKing', 'SlidePro', 'DashDemon', 'FlipFlopper', 'TwistTurner',
  'PixelPioneer', 'RetroRunner', 'ArcadeAce', 'GameGuru', 'LevelLord', 'ScoreSmasher', 'HighFlyer', 'LowCrawler', 'SideScroller', 'VerticalVoyager',
  'EpicExplorer', 'LegendaryLeaper', 'MythicMover', 'HeroicHopper', 'BraveBounder', 'CourageousClimber', 'DaringDasher', 'FearlessFlyer', 'GallantGamer',
  'IntrepidJumper', 'ValiantVault', 'BoldBouncer', 'StalwartSprinter', 'ResoluteRunner', 'TenaciousTurner', 'UnwaveringWarrior', 'VigilantVoyager', 'ZealousZoomer'
];

app.use(express.json());

app.use(express.static('public'));

// POST /score - post id and score
app.post('/score', async (req, res) => {
  let { id, score, playername } = req.body;
  if (!id || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid id or score' });
  }
  try {
    const existing = await prisma.leaderboard.findUnique({
      where: { id }
    });
    let entry;
    if (existing) {
      // Update existing
      const updateData = {};
      if (score > existing.score) {
        updateData.score = score;
      }
      if (playername) {
        updateData.playername = playername;
      } else if (!existing.playername) {
        updateData.playername = randomNames[Math.floor(Math.random() * randomNames.length)];
      }
      if (Object.keys(updateData).length > 0) {
        entry = await prisma.leaderboard.update({
          where: { id },
          data: updateData
        });
      } else {
        entry = existing; // No update needed
      }
    } else {
      // Create new
      if (!playername) {
        playername = randomNames[Math.floor(Math.random() * randomNames.length)];
      }
      entry = await prisma.leaderboard.create({
        data: { id, score, playername }
      });
    }
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

// GET /list - serve the leaderboard UI
app.get('/list', (req, res) => {
  res.sendFile(__dirname + '/public/list.html');
});

// GET /api/list - get all players JSON
app.get('/api/list', async (req, res) => {
  try {
    const allPlayers = await prisma.leaderboard.findMany({
      orderBy: { score: 'desc' }
    });
    res.json(allPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /rank/:id - get player's rank
app.get('/rank/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const player = await prisma.leaderboard.findUnique({
      where: { id }
    });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const higherCount = await prisma.leaderboard.count({
      where: {
        score: {
          gt: player.score
        }
      }
    });
    const rank = higherCount + 1;
    res.json({ id: player.id, playername: player.playername, score: player.score, rank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /player/:id/name - update player name
app.put('/player/:id/name', async (req, res) => {
  const { id } = req.params;
  const { playername } = req.body;
  if (!playername) {
    return res.status(400).json({ error: 'Playername is required' });
  }
  try {
    const updatedPlayer = await prisma.leaderboard.update({
      where: { id },
      data: { playername }
    });
    res.json(updatedPlayer);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});