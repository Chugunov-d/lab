import express from 'express';
import dotenv from 'dotenv';
import weatherRoutes from './weatherRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use('/api', weatherRoutes);

app.listen(PORT, () => {
  console.log(`Weather service is running on http://localhost:${PORT}`);
});
