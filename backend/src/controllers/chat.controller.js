import { chatAgronomist } from '../services/gemini.service.js';

export async function handleChat(req, res) {
    try {
        const { message, history, context } = req.body;
        
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message field is required' });
        }

        const reply = await chatAgronomist(history || [], message, context || {});

        return res.status(200).json({
            success: true,
            reply: reply
        });
    } catch (error) {
        console.error('Chat Controller Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error processing AI chat'
        });
    }
}
