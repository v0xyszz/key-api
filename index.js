const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 80;
const MONGO_URI = 'URL';
const SECRET_KEY = 'JWT KEY';

mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use(bodyParser.json());

const KeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  activatedBy: { type: String },
  computerId: { type: String }
});

const Key = mongoose.model('Key', KeySchema);

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ error: 'Invalid token' });
  }
};

function generateKey() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 36).toString(36).toUpperCase();
  });
}

app.post('/api/key/generate', authenticate, async (req, res) => {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Chave válida por 30 dias
  const key = new Key({ key: generateKey(), expiresAt });
  try {
    await key.save();
    res.status(201).send(key);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post('/api/key/activate', authenticate, async (req, res) => {
  const { key, computerId } = req.body;
  try {
    const foundKey = await Key.findOne({ key });
    if (!foundKey) {
      return res.status(404).send({ error: 'Key not found' });
    }
    if (new Date() > foundKey.expiresAt) {
      return res.status(400).send({ error: 'Key has expired' });
    }
    foundKey.isActive = true;
    foundKey.activatedBy = req.user.user;
    foundKey.computerId = computerId; // Adicionar computerId
    await foundKey.save();
    res.send(foundKey);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/key/delete/:key', authenticate, async (req, res) => {
  const { key } = req.params;
  try {
    const deletedKey = await Key.findOneAndDelete({ key });
    if (!deletedKey) {
      return res.status(404).send({ error: 'Key not found' });
    }
    res.send(deletedKey);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/api/keys', authenticate, async (req, res) => {
  try {
    const keys = await Key.find();
    res.send(keys);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/api/keys/status', authenticate, async (req, res) => {
  try {
    const keys = await Key.find({}, 'key isActive');
    res.send(keys);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Rota para gerar um token JWT
app.post('/api/token', (req, res) => {
  const payload = { user: 'api_user' };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
  res.send({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
