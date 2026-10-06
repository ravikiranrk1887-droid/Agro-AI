const API_BASE_URL = '/api';

export async function submitDiagnosis(formData, userId) {
    const res = await fetch(`${API_BASE_URL}/diagnose`, {
        method: 'POST',
        headers: {
            'x-user-id': userId || 'demo-user-123'
        },
        body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit diagnosis');
    return data;
}

export async function fetchDiagnoses(userId) {
    const res = await fetch(`${API_BASE_URL}/diagnoses`, {
        headers: { 'x-user-id': userId || 'demo-user-123' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch diagnoses');
    return data.data || [];
}

export async function submitSoilRecommendation(soilParams, userId) {
    const res = await fetch(`${API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId || 'demo-user-123'
        },
        body: JSON.stringify(soilParams)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit soil data');
    return data;
}

export async function fetchRecommendations(userId) {
    const res = await fetch(`${API_BASE_URL}/recommendations`, {
        headers: { 'x-user-id': userId || 'demo-user-123' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch recommendations');
    return data.data || [];
}

export async function sendChatMessage(message, history, context, userId) {
    const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId || 'demo-user-123'
        },
        body: JSON.stringify({ message, history, context })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send chat message');
    return data.reply;
}

export async function fetchFields(userId) {
    const res = await fetch(`${API_BASE_URL}/fields`, {
        headers: { 'x-user-id': userId || 'demo-user-123' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch fields');
    return data.fields || [];
}

export async function fetchFieldById(id, userId) {
    const res = await fetch(`${API_BASE_URL}/fields/${id}`, {
        headers: { 'x-user-id': userId || 'demo-user-123' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch field');
    return data.field;
}

export async function createField(fieldData, userId) {
    const res = await fetch(`${API_BASE_URL}/fields`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId || 'demo-user-123'
        },
        body: JSON.stringify(fieldData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create field');
    return data.field;
}

export async function fetchWeatherRisk(lat, lng) {
    const res = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lng=${lng}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch weather risk');
    return data;
}
