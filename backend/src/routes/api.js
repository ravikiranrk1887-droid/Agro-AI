import express from 'express';
import multer from 'multer';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { soilInputSchema, fieldCreateSchema, chatInputSchema } from '../utils/schemas.js';

import { handleDiagnose, handleGetDiagnoses } from '../controllers/diagnose.controller.js';
import { handleRecommend, handleGetRecommendations } from '../controllers/recommend.controller.js';
import { handleChat } from '../controllers/chat.controller.js';
import { handleGetFields, handleGetFieldById, handleCreateField } from '../controllers/fields.controller.js';
import { handleWeatherRisk } from '../controllers/weather.controller.js';

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
    }
});

const router = express.Router();

// Multimodal Crop Health Diagnosis Endpoint
router.post('/diagnose', aiRateLimiter, upload.single('image'), handleDiagnose);
router.get('/diagnoses', handleGetDiagnoses);

// Smart Soil & Crop Recommendation Engine Endpoint
router.post('/recommend', aiRateLimiter, validateBody(soilInputSchema), handleRecommend);
router.get('/recommendations', handleGetRecommendations);

// AI Agronomist Chatbot Endpoint
router.post('/chat', aiRateLimiter, validateBody(chatInputSchema), handleChat);

// Farm Plot / Fields Endpoints
router.get('/fields', handleGetFields);
router.get('/fields/:id', handleGetFieldById);
router.post('/fields', validateBody(fieldCreateSchema), handleCreateField);

// Weather Integrated Risk Modeling Endpoint
router.get('/weather', handleWeatherRisk);

export default router;
