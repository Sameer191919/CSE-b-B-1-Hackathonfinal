/**
 * Task Timer & Productivity Tracker - Backend
 * Simple Express server serving static frontend and providing:
 * - /api/quotes (GET): random motivational quote
 * - /api/leaderboard (GET, POST): local leaderboard
 * Data is stored in a lightweight JSON file for demo purposes.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

// Ensure data dir & file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LEADERBOARD_FILE)) fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([]));

// Basic middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Quotes (server-side curated for variety)
const QUOTES = [
  "Small steps every day lead to big results.",
  "Focus is a superpower. Guard it fiercely.",
  "You don’t need more time, you need more focus.",
  "Done is better than perfect.",
  "Your future is created by what you do today, not tomorrow.",
  "Discipline is choosing what you want most over what you want now.",
  "A little progress each day adds up to big results.",
  "The secret of getting ahead is getting started. — Mark Twain",
  "It always seems impossible until it’s done. — Nelson Mandela",
  "Success is the sum of small efforts, repeated day in and day out. — R. Collier"
];

app.get('/api/quotes', (req, res) => {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.json({ quote: q });
});

// Leaderboard helpers
function readLeaderboard() {
  try {
    const raw = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading leaderboard:', e);
    return [];
  }
}

function writeLeaderboard(arr) {
  try {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(arr, null, 2));
  } catch (e) {
    console.error('Error writing leaderboard:', e);
  }
}

// GET leaderboard (sorted by points desc)
app.get('/api/leaderboard', (req, res) => {
  const lb = readLeaderboard().sort((a, b) => b.points - a.points).slice(0, 50);
  res.json(lb);
});

// POST leaderboard entry: { name, points }
app.post('/api/leaderboard', (req, res) => {
  const { name, points } = req.body || {};
  if (!name || typeof points !== 'number') {
    return res.status(400).json({ error: 'name (string) and points (number) are required' });
  }
  const lb = readLeaderboard();
  const entry = { id: nanoid(10), name: String(name).slice(0, 32), points: Math.max(0, Math.floor(points)), at: new Date().toISOString() };
  lb.push(entry);
  writeLeaderboard(lb);
  res.status(201).json(entry);
});

// Fallback to index.html for SPA-ish routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
