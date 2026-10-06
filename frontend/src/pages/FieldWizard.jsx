import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { createField } from '../services/api';
import { z } from 'zod';
import { MapPin, Sprout, Layers, Compass, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const fieldCreateSchema = z.object({
    field_name: z.string().min(1, "Field name is required"),
    crop_type: z.string().min(1, "Crop type is required"),
    soil_type: z.string().min(1, "Soil type is required"),
    area_hectares: z.number().positive("Area must be greater than zero"),
    location_lat: z.number().optional().nullable(),
    location_lng: z.number().optional().nullable(),
});

export default function FieldWizard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        field_name: '',
        crop_type: 'Maize / Corn',
        soil_type: 'Sandy Loam',
        area_hectares: 10.0,
        location_lat: 36.778261,
        location_lng: -119.417931
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const cropOptions = ['Maize / Corn', 'Soybean', 'Wheat', 'Rice (Paddy)', 'Cotton', 'Chickpea', 'Tomato', 'Potato', 'Sugarcane'];
    const soilOptions = ['Alluvial', 'Black Regur', 'Red Laterite', 'Sandy Loam', 'Clay', 'Peaty'];

    const handleChange = (field, val) => {
        setFormData(prev => ({
            ...prev,
            [field]: ['area_hectares', 'location_lat', 'location_lng'].includes(field) ? parseFloat(val) || 0 : val
        }));
    };

    const handleNext = () => {
        if (step === 1 && !formData.field_name.trim()) {
            setErrors({ field_name: 'Field name is required' });
            return;
        }
        setErrors({});
        setStep(prev => prev + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const validated = fieldCreateSchema.parse(formData);
            await createField(validated, user?.id);
            navigate('/fields');
        } catch (err) {
            if (err.errors) {
                const formatted = {};
                err.errors.forEach(e => { formatted[e.path[0]] = e.message; });
                setErrors(formatted);
            } else {
                setErrors({ submit: err.message || 'Failed to create field plot' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                        <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-agri-400" /> Farm Plot Registration Wizard
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Register geographical coordinates, soil type, and crop history.</p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-between glass-card p-4 rounded-xl border border-slate-800">
                        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-agri-400' : 'text-slate-500'}`}>
                            <span className="w-6 h-6 rounded-full bg-agri-950 border border-agri-800 flex items-center justify-center text-xs">1</span>
                            <span>Plot Identity & Area</span>
                        </div>
                        <div className="w-12 h-0.5 bg-slate-800"></div>
                        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-agri-400' : 'text-slate-500'}`}>
                            <span className="w-6 h-6 rounded-full bg-agri-950 border border-agri-800 flex items-center justify-center text-xs">2</span>
                            <span>Soil & Geo Coordinates</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-agri-500/30 space-y-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">Field Plot Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.field_name}
                                        onChange={(e) => handleChange('field_name', e.target.value)}
                                        placeholder="e.g. North Valley Plot A"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-agri-500"
                                    />
                                    {errors.field_name && <p className="text-[10px] text-red-400 mt-1">{errors.field_name}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Crop Type</label>
                                        <select
                                            value={formData.crop_type}
                                            onChange={(e) => handleChange('crop_type', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                                        >
                                            {cropOptions.map((c, idx) => (
                                                <option key={idx} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">Total Plot Area (Hectares)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={formData.area_hectares}
                                            onChange={(e) => handleChange('area_hectares', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-agri-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full py-3 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center justify-center gap-2"
                                >
                                    Continue to Step 2 <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">Soil Classification</label>
                                    <select
                                        value={formData.soil_type}
                                        onChange={(e) => handleChange('soil_type', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                                    >
                                        {soilOptions.map((s, idx) => (
                                            <option key={idx} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">Latitude (°N/S)</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.location_lat}
                                            onChange={(e) => handleChange('location_lat', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">Longitude (°E/W)</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.location_lng}
                                            onChange={(e) => handleChange('location_lng', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                                        />
                                    </div>
                                </div>

                                {errors.submit && (
                                    <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-800">{errors.submit}</p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving Field...' : <><CheckCircle2 className="w-4 h-4" /> Save Field Record</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
}
