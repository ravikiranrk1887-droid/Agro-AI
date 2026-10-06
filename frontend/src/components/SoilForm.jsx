import React, { useState } from 'react';
import { z } from 'zod';
import { Compass, Sparkles, Sliders, AlertCircle, Droplets, Thermometer, CloudRain } from 'lucide-react';

const soilFormSchema = z.object({
    ph: z.number().min(0, 'pH must be at least 0').max(14, 'pH cannot exceed 14'),
    nitrogen: z.number().min(0, 'Nitrogen must be non-negative').max(500, 'Exceeds maximum range'),
    phosphorus: z.number().min(0, 'Phosphorus must be non-negative').max(300, 'Exceeds maximum range'),
    potassium: z.number().min(0, 'Potassium must be non-negative').max(500, 'Exceeds maximum range'),
    temperature: z.number().min(-20, 'Temperature out of bounds').max(60, 'Temperature out of bounds'),
    humidity: z.number().min(0, 'Humidity 0-100%').max(100, 'Humidity 0-100%'),
    rainfall: z.number().min(0, 'Rainfall must be non-negative'),
    soil_type: z.string().min(1, 'Soil type is required'),
    region: z.string().optional()
});

export default function SoilForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({
        ph: 6.5,
        nitrogen: 140,
        phosphorus: 55,
        potassium: 120,
        temperature: 26.5,
        humidity: 65,
        rainfall: 850,
        soil_type: 'Sandy Loam',
        region: 'Central Valley'
    });

    const [errors, setErrors] = useState({});

    const soilTypes = ['Alluvial', 'Black Regur', 'Red Laterite', 'Sandy Loam', 'Clay', 'Peaty'];

    const presets = [
        { name: 'Optimal Sandy Loam', ph: 6.8, nitrogen: 160, phosphorus: 60, potassium: 140, temp: 25, hum: 60, rain: 900, soil: 'Sandy Loam' },
        { name: 'High Fertility Black Soil', ph: 7.2, nitrogen: 210, phosphorus: 85, potassium: 220, temp: 28, hum: 70, rain: 1100, soil: 'Black Regur' },
        { name: 'Acidic Laterite', ph: 5.4, nitrogen: 90, phosphorus: 30, potassium: 80, temp: 30, hum: 80, rain: 1400, soil: 'Red Laterite' }
    ];

    const applyPreset = (preset) => {
        setFormData({
            ...formData,
            ph: preset.ph,
            nitrogen: preset.nitrogen,
            phosphorus: preset.phosphorus,
            potassium: preset.potassium,
            temperature: preset.temp,
            humidity: preset.hum,
            rainfall: preset.rain,
            soil_type: preset.soil
        });
        setErrors({});
    };

    const handleChange = (field, value) => {
        const numValue = ['ph', 'nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'rainfall'].includes(field)
            ? parseFloat(value) || 0
            : value;

        setFormData(prev => ({ ...prev, [field]: numValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const validated = soilFormSchema.parse(formData);
            setErrors({});
            onSubmit(validated);
        } catch (err) {
            if (err.errors) {
                const formatted = {};
                err.errors.forEach(e => {
                    formatted[e.path[0]] = e.message;
                });
                setErrors(formatted);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-agri-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
                        <Compass className="w-5 h-5 text-agri-400" /> Soil & Environmental Chemistry Parameters
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Input N-P-K levels, pH index, and climate metrics for Gemini agronomic inference.</p>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
                    </span>
                    {presets.map((p, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => applyPreset(p)}
                            className="px-2.5 py-1 bg-slate-800/80 hover:bg-agri-950/80 hover:border-agri-500 text-[11px] text-slate-300 rounded-lg border border-slate-700 transition-all"
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* pH Slider & Input */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-slate-300">Soil pH Level</label>
                        <span className="font-bold text-agri-400 bg-agri-950/80 px-2 py-0.5 rounded border border-agri-800">{formData.ph}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="14"
                        step="0.1"
                        value={formData.ph}
                        onChange={(e) => handleChange('ph', e.target.value)}
                        className="w-full accent-agri-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>0 Acidic</span>
                        <span>7 Neutral</span>
                        <span>14 Alkaline</span>
                    </div>
                    {errors.ph && <p className="text-[10px] text-red-400">{errors.ph}</p>}
                </div>

                {/* Nitrogen (N) */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-slate-300">Nitrogen (N) <span className="text-[10px] text-slate-400">(kg/ha)</span></label>
                        <input
                            type="number"
                            value={formData.nitrogen}
                            onChange={(e) => handleChange('nitrogen', e.target.value)}
                            className="w-16 text-right bg-slate-950 text-agri-300 px-2 py-0.5 rounded text-xs border border-slate-700 font-bold"
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="300"
                        value={formData.nitrogen}
                        onChange={(e) => handleChange('nitrogen', e.target.value)}
                        className="w-full accent-agri-500 cursor-pointer"
                    />
                    {errors.nitrogen && <p className="text-[10px] text-red-400">{errors.nitrogen}</p>}
                </div>

                {/* Phosphorus (P) */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-slate-300">Phosphorus (P) <span className="text-[10px] text-slate-400">(kg/ha)</span></label>
                        <input
                            type="number"
                            value={formData.phosphorus}
                            onChange={(e) => handleChange('phosphorus', e.target.value)}
                            className="w-16 text-right bg-slate-950 text-agri-300 px-2 py-0.5 rounded text-xs border border-slate-700 font-bold"
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="150"
                        value={formData.phosphorus}
                        onChange={(e) => handleChange('phosphorus', e.target.value)}
                        className="w-full accent-agri-500 cursor-pointer"
                    />
                    {errors.phosphorus && <p className="text-[10px] text-red-400">{errors.phosphorus}</p>}
                </div>

                {/* Potassium (K) */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-slate-300">Potassium (K) <span className="text-[10px] text-slate-400">(kg/ha)</span></label>
                        <input
                            type="number"
                            value={formData.potassium}
                            onChange={(e) => handleChange('potassium', e.target.value)}
                            className="w-16 text-right bg-slate-950 text-agri-300 px-2 py-0.5 rounded text-xs border border-slate-700 font-bold"
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="300"
                        value={formData.potassium}
                        onChange={(e) => handleChange('potassium', e.target.value)}
                        className="w-full accent-agri-500 cursor-pointer"
                    />
                    {errors.potassium && <p className="text-[10px] text-red-400">{errors.potassium}</p>}
                </div>
            </div>

            {/* Environmental & Regional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Avg Temperature (°C)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => handleChange('temperature', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity (%)
                    </label>
                    <input
                        type="number"
                        value={formData.humidity}
                        onChange={(e) => handleChange('humidity', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                        <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Annual Rainfall (mm)
                    </label>
                    <input
                        type="number"
                        value={formData.rainfall}
                        onChange={(e) => handleChange('rainfall', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Soil Type Classification</label>
                    <select
                        value={formData.soil_type}
                        onChange={(e) => handleChange('soil_type', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                    >
                        {soilTypes.map((st, i) => (
                            <option key={i} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Calculating Gemini Agronomic Match...
                        </>
                    ) : (
                        <>
                            <Compass className="w-4 h-4" /> Run Gemini Crop Recommendation
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
