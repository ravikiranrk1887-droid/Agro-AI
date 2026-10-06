import { recommendCrops } from '../services/gemini.service.js';
import { saveRecommendation, getUserRecommendations } from '../services/supabase.service.js';

export async function handleRecommend(req, res) {
    try {
        const userId = req.headers['x-user-id'] || 'demo-user-123';
        const soilData = req.body;

        const result = await recommendCrops(soilData);
        const record = await saveRecommendation(userId, soilData, result.recommended_crops || []);

        return res.status(200).json({
            success: true,
            recommendation: record
        });
    } catch (error) {
        console.error('Recommendation Controller Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to process crop recommendations'
        });
    }
}

export async function handleGetRecommendations(req, res) {
    try {
        const userId = req.headers['x-user-id'] || 'demo-user-123';
        const history = await getUserRecommendations(userId);
        return res.status(200).json({ success: true, data: history });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
