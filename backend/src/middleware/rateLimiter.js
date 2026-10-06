import rateLimit from 'express-rate-limit';

// Strict rate limiting: maximum 20 requests per minute per IP for AI endpoints
export const aiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // max 20 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many requests from this IP to the AI Agronomist system. Please try again after 1 minute.'
    }
});
