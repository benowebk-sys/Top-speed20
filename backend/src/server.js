import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/auth.js';
import { connectDB } from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import modificationRoutes from './routes/modificationRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import configuratorRoutes from './routes/configuratorRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: function(origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:5178',
        'http://localhost:5179',
        'http://localhost:5180',
        'http://localhost:3000',
        'http://192.168.1.6:5173',
        'http://192.168.1.6:5174',
        'http://192.168.1.6:5175',
        'http://192.168.1.6:5176',
        'http://192.168.1.6:5177',
        'http://192.168.1.6:5178',
        'http://192.168.1.6:5179',
        'http://192.168.1.6:5180',
        'http://192.168.1.6:3000',
        process.env.FRONTEND_URL || 'http://192.168.1.6:5176',
        'https://topspeed-frontend.vercel.app',
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('CORS blocked:', origin);
        callback(null, true); // Allow all for development
      }
    },
    credentials: true,
  })
);

// Connect to MongoDB
connectDB().catch(err => {
  console.warn('⚠️ Database initialization warning', err?.message || '');
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/modifications', modificationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/configurator', configuratorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ TOP SPEED Backend running on http://localhost:${PORT}`);
});
