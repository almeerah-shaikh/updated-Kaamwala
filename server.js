const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const app = express();
const port = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function loadDatabase() {
  if (!fs.existsSync(dataFile)) {
    return { providers: [], bookings: [], users: [] };
  }
  const raw = fs.readFileSync(dataFile, 'utf8');
  const data = JSON.parse(raw);
  data.providers = data.providers || [];
  data.bookings = data.bookings || [];
  data.users = data.users || [];
  return data;
}

function saveDatabase(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

app.get('/api/providers', (req, res) => {
  const db = loadDatabase();
  res.json(db.providers || []);
});

app.get('/api/bookings', authenticate, (req, res) => {
  const db = loadDatabase();
  const userBookings = (db.bookings || []).filter(bk => bk.userId === req.user.id);
  res.json(userBookings);
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const db = loadDatabase();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'Account already exists for this email.' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);
  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email, token });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = loadDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ id: user.id, name: user.name, email: user.email, token });
});

app.get('/api/users/:id', (req, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/bookings', authenticate, (req, res) => {
  const newBooking = req.body;
  if (!newBooking || !newBooking.id) {
    return res.status(400).json({ error: 'Booking object with id is required.' });
  }

  const db = loadDatabase();
  db.bookings = db.bookings || [];
  const existing = db.bookings.find(bk => bk.id === newBooking.id);
  if (existing) {
    return res.status(409).json({ error: 'Booking already exists.' });
  }

  // associate booking with authenticated user
  newBooking.userId = req.user && req.user.id ? req.user.id : newBooking.userId;

  db.bookings.push(newBooking);

  if (newBooking.providerId) {
    const provider = db.providers.find(p => p.id === newBooking.providerId);
    if (provider) {
      provider.isBusy = true;
    }
  }

  saveDatabase(db);
  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id', authenticate, (req, res) => {
  const bookingId = req.params.id;
  const updates = req.body;
  const db = loadDatabase();
  const booking = db.bookings.find(bk => bk.id === bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  // optionally restrict who can update: the booking owner or providers
  if (req.user && req.user.id && booking.userId && booking.userId !== req.user.id) {
    // allow providers to update status if they are involved (skip strict checks for demo)
    // For now we allow update if owner or otherwise permit to proceed
  }

  Object.assign(booking, updates);
  saveDatabase(db);
  res.json(booking);
});

app.patch('/api/providers/:id', (req, res) => {
  const providerId = req.params.id;
  const updates = req.body;
  const db = loadDatabase();
  const provider = db.providers.find(p => p.id === providerId);
  if (!provider) {
    return res.status(404).json({ error: 'Provider not found.' });
  }

  Object.assign(provider, updates);
  saveDatabase(db);
  res.json(provider);
});

app.get('/api/state', (req, res) => {
  res.json(loadDatabase());
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Kaamwala backend running on http://localhost:${port}`);
});
