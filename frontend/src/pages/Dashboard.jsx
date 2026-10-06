import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import WeatherWidget from '../components/WeatherWidget';
import { fetchFields, fetchDiagnoses } from '../services/api';
import { MapPin, Stethoscope, Compass, Bot, PlusCircle, ArrowRight, ShieldAlert, Activity, Leaf, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Dashboard() {
    const { user, profile } = useAuth();
    const [fields, setFields] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [fData, dData] = await Promise.all([
                    fetchFields(user?.id),
                    fetchDiagnoses(user?.id)
                ]);
                setFields(fData);
                setDiagnoses(dData);
            } catch (err) {
                console.error('Dashboard data load error:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, [user]);

    const totalHectares = fields.reduce((sum, f) => sum + (parseFloat(f.area_hectares) || 0), 0);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-agri-500/30">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-agri-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Leaf className="w-3.5 h-3.5" /> Farm Operations Command Center
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                                Welcome back, {profile?.full_name || 'Farmer'}!
                            </h1>
                            <p className="text-xs text-slate-400">
                                Region: <span className="text-slate-200 font-semibold">{profile?.region || 'Central Valley'}</span> | Role: <span className="text-agri-400 font-semibold">{profile?.role || 'Farmer'}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                to="/diagnose"
                                className="px-4 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-2"
                            >
                                <Stethoscope className="w-4 h-4" /> Instant Crop Diagnosis
                            </Link>
                            <Link
                                to="/fields/new"
                                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4 text-agri-400" /> New Field Plot
                            </Link>
                        </div>
                    </div>

                    {/* Quick Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card p-5 rounded-xl border border-agri-500/20">
                            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                                <span>Active Farm Plots</span>
                                <MapPin className="w-4 h-4 text-agri-400" />
                            </div>
                            <p className="text-2xl font-extrabold text-white font-['Outfit'] mt-2">{fields.length}</p>
                            <p className="text-[11px] text-agri-400 mt-1">Geo-tagged and monitored</p>
                        </div>

                        <div className="glass-card p-5 rounded-xl border border-agri-500/20">
                            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                                <span>Total Acreage</span>
                                <Leaf className="w-4 h-4 text-agri-400" />
                            </div>
                            <p className="text-2xl font-extrabold text-white font-['Outfit'] mt-2">
                                {totalHectares.toFixed(1)} <span className="text-sm font-normal text-slate-400">Ha</span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">{(totalHectares * 2.471).toFixed(1)} Acres Total</p>
                        </div>

                        <div className="glass-card p-5 rounded-xl border border-agri-500/20">
                            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                                <span>AI Diagnoses Run</span>
                                <Stethoscope className="w-4 h-4 text-agri-400" />
                            </div>
                            <p className="text-2xl font-extrabold text-white font-['Outfit'] mt-2">{diagnoses.length}</p>
                            <p className="text-[11px] text-agri-400 mt-1">Gemini Multimodal Vision</p>
                        </div>

                        <div className="glass-card p-5 rounded-xl border border-agri-500/20">
                            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                                <span>Pathology Health Index</span>
                                <ShieldAlert className="w-4 h-4 text-amber-400" />
                            </div>
                            <p className="text-2xl font-extrabold text-amber-400 font-['Outfit'] mt-2">Optimal</p>
                            <p className="text-[11px] text-slate-400 mt-1">No critical field quarantine</p>
                        </div>
                    </div>

                    {/* Middle Section: Weather Advisory & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Registered Fields Summary */}
                            <div className="glass-card rounded-2xl p-5 border border-agri-500/30 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                                        <MapPin className="w-4.5 h-4.5 text-agri-400" /> Managed Farm Fields
                                    </h3>
                                    <Link to="/fields" className="text-xs text-agri-400 font-semibold hover:underline flex items-center gap-1">
                                        View All ({fields.length}) <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                {fields.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {fields.slice(0, 4).map((f) => (
                                            <Link
                                                key={f.id}
                                                to={`/fields/${f.id}`}
                                                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-agri-500/50 transition-all space-y-2 group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-agri-300 font-['Outfit']">{f.field_name}</h4>
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{f.area_hectares} Ha</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                                    <span>Crop: <strong className="text-slate-300">{f.crop_type}</strong></span>
                                                    <span>Soil: <strong className="text-slate-300">{f.soil_type}</strong></span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 space-y-2">
                                        <p className="text-xs text-slate-400">No farm fields registered yet.</p>
                                        <Link to="/fields/new" className="inline-flex items-center gap-2 text-xs font-bold text-agri-400 hover:underline">
                                            <PlusCircle className="w-4 h-4" /> Register your first field plot
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Recent Diagnoses Log */}
                            <div className="glass-card rounded-2xl p-5 border border-agri-500/30 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                                        <Stethoscope className="w-4.5 h-4.5 text-agri-400" /> Recent Multimodal Crop Diagnoses
                                    </h3>
                                    <Link to="/diagnose" className="text-xs text-agri-400 font-semibold hover:underline flex items-center gap-1">
                                        Run Diagnosis <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                {diagnoses.length > 0 ? (
                                    <div className="space-y-3">
                                        {diagnoses.slice(0, 3).map((d) => (
                                            <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                                                <div className="flex items-center gap-3">
                                                    {d.image_url && (
                                                        <img src={d.image_url} alt={d.crop_name} className="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-slate-200">{d.detected_issue}</p>
                                                        <p className="text-[11px] text-slate-400">{d.crop_name} | Confidence: {d.confidence_score}%</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    d.severity === 'High' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                                                }`}>
                                                    {d.severity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 space-y-2">
                                        <p className="text-xs text-slate-400">No crop diagnosis records yet.</p>
                                        <Link to="/diagnose" className="inline-flex items-center gap-2 text-xs font-bold text-agri-400 hover:underline">
                                            <Stethoscope className="w-4 h-4" /> Upload a leaf photo for AI analysis
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar: Weather Widget & Quick Action Tiles */}
                        <div className="space-y-6">
                            <WeatherWidget />

                            <div className="glass-card rounded-2xl p-5 border border-agri-500/30 space-y-3">
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Action Shortcuts</h4>
                                
                                <Link
                                    to="/recommendations"
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
                                >
                                    <span className="flex items-center gap-2">
                                        <Compass className="w-4 h-4 text-agri-400" /> Soil N-P-K Calculator
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-agri-400 transition-colors" />
                                </Link>

                                <Link
                                    to="/advisor"
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
                                >
                                    <span className="flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-agri-400" /> Ask AI Agronomist Chat
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-agri-400 transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
