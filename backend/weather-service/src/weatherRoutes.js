import express from 'express';
import { getFormattedData } from './weatherService.js';

const router = express.Router();

router.get('/weather', async (req, res) => {
  const { q, units = 'metric' } = req.query;
  try {
    const weatherData = await getFormattedData({ q, units });
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
