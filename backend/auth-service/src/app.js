const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

require('dotenv').config();

const sequelize = require('./config');
const User = require('../models/user');

const app = express();
app.use(express.json());
app.use(cors());


app.get('/auth', (req, res) => {
  res.send('Hello, world!');
});

// Регистрация
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });
      res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
      res.status(400).json({ error: 'Email already in use' });
  }
});

// Аутентификация
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, {
          expiresIn: '1h',
      });
      res.json({ token });
  } catch (err) {
      res.status(500).json({ error: 'Login failed' });
  }
});

// Профиль пользователя
app.get('/auth/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).json({ error: 'Token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findByPk(decoded.id);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json({ email: user.email });
  } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
  }
});

// Запуск сервера
(async () => {
  try {
      await sequelize.sync();
      console.log('Database connected');
      
      const PORT = process.env.PORT || 4001;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
      console.error('Unable to connect to the database:', err);
  }
})();