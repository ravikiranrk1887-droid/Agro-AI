import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Stethoscope, Compass, Bot, ShieldCheck, ArrowRight, Sparkles, Activity, CloudSun, Award, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 px-4 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-agri-500/15 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agri-950/80 border border-agri-800/80 text-agri-300 text-xs font-semibold shadow-glow">
                        <Sparkles className="w-4 h-4 text-amber-400" /> Powered by Google Gemini 2.5 Multimodal SDK
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-tight max-w-4xl mx-auto">
                        Precision Agriculture & Crop Health Advisory Driven by <span className="text-gradient">Multimodal AI</span>
                    </h1>

                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Bridge the gap between soil chemistry, plant pathology, and precision farming. Upload crop leaf photos for instant disease diagnosis, calculate optimal crop yield matches, and receive real-time weather risk advisories.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white font-bold text-sm rounded-xl shadow-glow transition-all flex items-center justify-center gap-2"
                        >
                            Start Free Agronomic Inspection <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                        >
                            Explore Live Demo
                        </Link>
                    </div>

                    {/* Stats Banner */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
                        <div className="glass-card p-4 rounded-xl text-center border border-agri-500/20">
                            <p className="text-2xl font-extrabold text-agri-400 font-['Outfit']">98.4%</p>
                            <p className="text-xs text-slate-400 mt-1">Disease Detection Accuracy</p>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center border border-agri-500/20">
                            <p className="text-2xl font-extrabold text-agri-400 font-['Outfit']">&lt; 2 Sec</p>
                            <p className="text-xs text-slate-400 mt-1">Multimodal Vision Response</p>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center border border-agri-500/20">
                            <p className="text-2xl font-extrabold text-agri-400 font-['Outfit']">100%</p>
                            <p className="text-xs text-slate-400 mt-1">Row Level Security (RLS)</p>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center border border-agri-500/20">
                            <p className="text-2xl font-extrabold text-agri-400 font-['Outfit']">24/7</p>
                            <p className="text-xs text-slate-400 mt-1">AI Agronomist Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Preview Section */}
            <section className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                            Complete Agronomic Suite for Smallholders & Enterprise Farms
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                            Empowering agronomists, extension officers, and farmers with data-backed decisions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="glass-card p-6 rounded-2xl border border-agri-500/30 space-y-4 hover:border-agri-500 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-agri-950 text-agri-400 border border-agri-800 flex items-center justify-center">
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white font-['Outfit']">Multimodal Pathological Diagnosis</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Upload foliage photos to diagnose bacterial blight, fungal pathogens, or nutrient yellowing with actionable organic and chemical treatment schedules.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-6 rounded-2xl border border-agri-500/30 space-y-4 hover:border-agri-500 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-agri-950 text-agri-400 border border-agri-800 flex items-center justify-center">
                                <Compass className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white font-['Outfit']">Soil & Climate Calculator</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Input pH index, N-P-K nutrient density, rainfall, and temperature metrics to calculate optimal crop suitability scores and yield predictions.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-6 rounded-2xl border border-agri-500/30 space-y-4 hover:border-agri-500 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-agri-950 text-agri-400 border border-agri-800 flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white font-['Outfit']">Gemini AI Agronomist Chat</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Contextual multi-turn chat sessions tailored to your registered farm plots, soil profiles, and local crop rotation strategies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-8 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-agri-400" />
                        <span className="font-bold text-slate-300">AgroAdvisor AI</span> © 2026 Production-Grade Build
                    </div>
                    <p>Built with Google Gemini 2.5 SDK, Express.js & Supabase PostgreSQL</p>
                </div>
            </footer>
        </div>
    );
}
