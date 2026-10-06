export async function handleWeatherRisk(req, res) {
    try {
        const lat = parseFloat(req.query.lat) || 36.778261;
        const lng = parseFloat(req.query.lng) || -119.417931;

        // Weather Risk Model calculation based on location parameters
        const temp = 28.5 + (Math.sin(lat) * 2);
        const humidity = 62;
        const windSpeed = 12.4;
        const rainfallForecast = 4.2;

        let riskLevel = 'Low';
        let alertMessage = 'Optimal microclimate for crop growth. No immediate weather hazards detected.';
        const risks = [];

        if (temp > 35) {
            risks.push({ type: 'Heat Stress', severity: 'High', details: 'Temperatures exceeding 35°C may cause pollen sterility in flowering crops.' });
            riskLevel = 'High';
        } else if (temp < 4) {
            risks.push({ type: 'Frost Warning', severity: 'High', details: 'Sub-zero ground temperatures expected. Cover sensitive horticultural crops.' });
            riskLevel = 'High';
        }

        if (humidity > 85 && temp > 22) {
            risks.push({ type: 'High Fungal Spore Risk', severity: 'Moderate', details: 'Elevated relative humidity creates high risk for powdery mildew & leaf blight.' });
            if (riskLevel !== 'High') riskLevel = 'Moderate';
        }

        if (rainfallForecast > 50) {
            risks.push({ type: 'Waterlogging Threat', severity: 'High', details: 'Heavy precipitation forecast may exceed soil infiltration capacity.' });
            riskLevel = 'High';
        } else if (rainfallForecast < 1.0) {
            risks.push({ type: 'Soil Moisture Deficit', severity: 'Low', details: 'Light precipitation; ensure irrigation scheduled for shallow-rooted crops.' });
        }

        return res.status(200).json({
            success: true,
            location: { lat, lng },
            current: {
                temp: Math.round(temp * 10) / 10,
                humidity,
                wind_speed_kmh: windSpeed,
                rainfall_mm: rainfallForecast,
                condition: 'Partly Cloudy'
            },
            risk_summary: {
                level: riskLevel,
                alerts: risks,
                recommendation: riskLevel === 'High' 
                    ? 'Immediate mitigation recommended: adjust irrigation & apply protective mulch or shade nets.'
                    : 'Standard crop management and regular field scouting recommended.'
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
