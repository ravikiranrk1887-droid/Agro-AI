import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API Router
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'AgroAdvisor AI Backend Engine',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Only start listener in local/non-serverless environments
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 AI Agronomist Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel Serverless Functions
export default app;
