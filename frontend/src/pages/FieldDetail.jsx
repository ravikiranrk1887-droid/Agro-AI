import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import WeatherWidget from '../components/WeatherWidget';
import { fetchFieldById, fetchDiagnoses } from '../services/api';
import { MapPin, Sprout, Layers, Globe, Stethoscope, ArrowLeft, Calendar, ShieldCheck, Compass } from 'lucide-react';

export default function FieldDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [field, setField] = useState(null);
    const [diagnoses, setDiagnoses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const [fData, dData] = await Promise.all([
                    fetchFieldById(id, user?.id),
                    fetchDiagnoses(user?.id)
                ]);
                setField(fData);
                // Filter diagnoses for this field or default list
                setDiagnoses(dData.filter(d => d.field_id === id || !d.field_id));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [id, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-agri-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!field) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <p className="text-slate-400">Field record not found.</p>
                    <Link to="/fields" className="text-agri-400 font-semibold mt-2 hover:underline">Return to Farm Fields</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    <Link to="/fields" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Farm Plots
                    </Link>

                    {/* Field Header Card */}
                    <div className="glass-card rounded-2xl p-6 border border-agri-500/30 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                            <div>
                                <span className="text-xs font-bold text-agri-400 uppercase tracking-wider">Field Inspection Log</span>
                                <h1 className="text-2xl font-extrabold text-white font-['Outfit']">{field.field_name}</h1>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to="/diagnose"
                                    className="px-4 py-2 bg-gradient-to-r from-agri-600 to-agri-500 text-white text-xs font-bold rounded-xl shadow-glow"
                                >
                                    Inspect Crop Leaf Photo
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Cultivated Crop</span>
                                <span className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                                    <Sprout className="w-4 h-4 text-agri-400" /> {field.crop_type}
                                </span>
                            </div>

                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Soil Matrix</span>
                                <span className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                                    <Layers className="w-4 h-4 text-earth-400" /> {field.soil_type}
                                </span>
                            </div>

                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Plot Acreage</span>
                                <span className="font-bold text-white text-sm mt-0.5 block">{field.area_hectares} Hectares</span>
                            </div>

                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">GPS Coordinates</span>
                                <span className="font-bold text-slate-300 text-xs mt-0.5 block flex items-center gap-1">
                                    <Globe className="w-3.5 h-3.5 text-slate-500" /> {field.location_lat || 36.77}, {field.location_lng || -119.41}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Historical Pathological Advisories */}
                            <div className="glass-card rounded-2xl p-5 border border-agri-500/30 space-y-4">
                                <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                                    <Stethoscope className="w-4.5 h-4.5 text-agri-400" /> Historical Diagnostic Log for {field.field_name}
                                </h3>

                                {diagnoses.length > 0 ? (
                                    <div className="space-y-3">
                                        {diagnoses.map((d) => (
                                            <div key={d.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-slate-200">{d.detected_issue}</h4>
                                                        <p className="text-[11px] text-slate-400">Confidence: {d.confidence_score}%</p>
                                                    </div>
                                                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                                        d.severity === 'High' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                                                    }`}>
                                                        {d.severity} Severity
                                                    </span>
                                                </div>
                                                {d.treatment_plan?.organic && (
                                                    <p className="text-slate-300 text-[11px]">Organic: {d.treatment_plan.organic[0]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 py-4 text-center">No pathology records attached to this plot yet.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <WeatherWidget lat={parseFloat(field.location_lat) || 36.778261} lng={parseFloat(field.location_lng) || -119.417931} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
