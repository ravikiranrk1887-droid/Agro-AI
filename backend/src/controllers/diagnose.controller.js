import { analyzeCropHealth } from '../services/gemini.service.js';
import { saveDiagnosis, getUserDiagnoses } from '../services/supabase.service.js';

export async function handleDiagnose(req, res) {
    try {
        const userId = req.headers['x-user-id'] || 'demo-user-123';
        const { crop_name, field_id, additional_notes } = req.body;
        
        let fileBuffer = null;
        let mimeType = 'image/jpeg';
        let imageUrl = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=800&q=80'; // Fallback sample crop leaf image

        if (req.file) {
            fileBuffer = req.file.buffer;
            mimeType = req.file.mimetype;
            // Convert to base64 data URL for persistence
            imageUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        } else if (req.body.image_url) {
            imageUrl = req.body.image_url;
        }

        // Call Gemini Service
        const result = await analyzeCropHealth(fileBuffer || Buffer.from(''), mimeType, crop_name, additional_notes);

        // Save diagnosis to database
        const diagnosisRecord = await saveDiagnosis(userId, {
            field_id: field_id || null,
            image_url: imageUrl,
            crop_name: crop_name || 'Crop',
            detected_issue: result.detected_issue || 'Unspecified Condition',
            confidence_score: result.confidence_score || 92.0,
            severity: result.severity || 'Moderate',
            symptoms: result.symptoms || [],
            treatment_plan: {
                organic: result.organic_treatment || [],
                chemical: result.chemical_treatment || [],
                preventative: result.preventative_measures || []
            }
        });

        return res.status(200).json({
            success: true,
            diagnosis: diagnosisRecord
        });
    } catch (error) {
        console.error('Diagnosis Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze crop image'
        });
    }
}

export async function handleGetDiagnoses(req, res) {
    try {
        const userId = req.headers['x-user-id'] || 'demo-user-123';
        const records = await getUserDiagnoses(userId);
        return res.status(200).json({ success: true, data: records });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
