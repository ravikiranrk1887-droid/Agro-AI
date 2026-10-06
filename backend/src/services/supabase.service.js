import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-project')) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

// In-Memory Storage Fallback when Supabase database is not configured
const memoryStore = {
    fields: [
        {
            id: 'field-101',
            user_id: 'demo-user-123',
            field_name: 'North Valley Plot A',
            crop_type: 'Maize / Corn',
            soil_type: 'Sandy Loam',
            area_hectares: 12.5,
            location_lat: 36.778261,
            location_lng: -119.417931,
            created_at: new Date(Date.now() - 86400000 * 15).toISOString()
        },
        {
            id: 'field-102',
            user_id: 'demo-user-123',
            field_name: 'East River Orchard',
            crop_type: 'Soybean',
            soil_type: 'Alluvial',
            area_hectares: 8.2,
            location_lat: 36.800123,
            location_lng: -119.430456,
            created_at: new Date(Date.now() - 86400000 * 5).toISOString()
        }
    ],
    diagnoses: [],
    recommendations: [],
    chat_sessions: []
};

export async function saveField(userId, fieldData) {
    if (supabase) {
        const { data, error } = await supabase
            .from('fields')
            .insert([{ ...fieldData, user_id: userId }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    const newField = {
        id: `field-${Date.now()}`,
        user_id: userId,
        ...fieldData,
        created_at: new Date().toISOString()
    };
    memoryStore.fields.unshift(newField);
    return newField;
}

export async function getUserFields(userId) {
    if (supabase) {
        const { data, error } = await supabase
            .from('fields')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (!error) return data;
    }
    return memoryStore.fields.filter(f => f.user_id === userId || userId === 'demo-user-123');
}

export async function getFieldById(userId, fieldId) {
    if (supabase) {
        const { data, error } = await supabase
            .from('fields')
            .select('*')
            .eq('id', fieldId)
            .single();
        if (!error) return data;
    }
    return memoryStore.fields.find(f => f.id === fieldId) || memoryStore.fields[0];
}

export async function saveDiagnosis(userId, diagnosisData) {
    if (supabase) {
        const { data, error } = await supabase
            .from('diagnoses')
            .insert([{ ...diagnosisData, user_id: userId }])
            .select()
            .single();
        if (!error) return data;
    }

    const record = {
        id: `diag-${Date.now()}`,
        user_id: userId,
        ...diagnosisData,
        created_at: new Date().toISOString()
    };
    memoryStore.diagnoses.unshift(record);
    return record;
}

export async function getUserDiagnoses(userId) {
    if (supabase) {
        const { data, error } = await supabase
            .from('diagnoses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (!error) return data;
    }
    return memoryStore.diagnoses.filter(d => d.user_id === userId || userId === 'demo-user-123');
}

export async function saveRecommendation(userId, soilData, recommendedCrops) {
    if (supabase) {
        const { data, error } = await supabase
            .from('recommendations')
            .insert([{ user_id: userId, soil_data: soilData, recommended_crops: recommendedCrops }])
            .select()
            .single();
        if (!error) return data;
    }

    const record = {
        id: `rec-${Date.now()}`,
        user_id: userId,
        soil_data: soilData,
        recommended_crops: recommendedCrops,
        created_at: new Date().toISOString()
    };
    memoryStore.recommendations.unshift(record);
    return record;
}

export async function getUserRecommendations(userId) {
    if (supabase) {
        const { data, error } = await supabase
            .from('recommendations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (!error) return data;
    }
    return memoryStore.recommendations.filter(r => r.user_id === userId || userId === 'demo-user-123');
}
