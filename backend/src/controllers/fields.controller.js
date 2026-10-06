import { saveField, getUserFields, getFieldById } from '../services/supabase.service.js';

export async function handleGetFields(req, res) {
    try {
        const userId = req.headers['x-user-id'] || 'demo-user-123';
        const fields = await getUserFields(userId);
        return res.status(200).json({ success: true, fields });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function handleGetFieldById(req, res) {
    try {
        const userId = req.headers['x-user-id'] || 'demo-user-123';
        const { id } = req.params;
        const field = await getFieldById(userId, id);
        if (!field) {
            return res.status(404).json({ success: false, error: 'Field plot not found' });
        }
        return res.status(200).json({ success: true, field });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function handleCreateField(req, res) {
    try {
        const userId = req.headers['x-user-id'] || 'demo-user-123';
        const fieldData = req.body;
        const newField = await saveField(userId, fieldData);
        return res.status(201).json({ success: true, field: newField });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
