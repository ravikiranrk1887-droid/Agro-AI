import React from 'react';
import { Award, TrendingUp, CheckCircle2, FlaskConical, ArrowRight, HelpCircle } from 'lucide-react';

export default function RecommendationTable({ recommendations, onSelectCrop }) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
                    <Award className="w-5 h-5 text-amber-400" /> Optimal Crop Matches & Yield Projections
                </h3>
                <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    {recommendations.length} Recommended Options
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {recommendations.map((crop, idx) => (
                    <div
                        key={idx}
                        className="glass-card rounded-xl p-5 border border-agri-500/30 hover:border-agri-500/60 transition-all space-y-4"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-agri-950/80 border border-agri-800 text-agri-400 flex items-center justify-center font-bold text-lg">
                                    #{idx + 1}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white font-['Outfit']">{crop.crop_name}</h4>
                                    <p className="text-xs text-agri-400 font-semibold flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" /> Projecting {crop.expected_yield_tons_per_hectare} Tons / Hectare
                                    </p>
                                </div>
                            </div>

                            {/* Suitability Score Meter */}
                            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                                <span className="text-xs text-slate-400 font-medium">Suitability</span>
                                <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-agri-500 to-agri-300 h-full rounded-full"
                                        style={{ width: `${crop.suitability_score}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-agri-300">{crop.suitability_score}%</span>
                            </div>
                        </div>

                        {/* Reasoning & Agronomic Fit */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agronomic Reasoning & Soil Dynamics</p>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                                {crop.reasoning}
                            </p>
                        </div>

                        {/* Fertilizer Recommendations */}
                        <div className="p-3.5 rounded-lg bg-agri-950/30 border border-agri-800/40 flex items-start gap-3">
                            <FlaskConical className="w-4 h-4 text-agri-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-agri-300">Fertilizer Top-Dressing Protocol</p>
                                <p className="text-xs text-slate-300 mt-0.5">{crop.fertilizer_recommendations}</p>
                            </div>
                        </div>

                        {onSelectCrop && (
                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => onSelectCrop(crop)}
                                    className="flex items-center gap-1.5 text-xs text-agri-400 font-semibold hover:text-agri-300 transition-colors"
                                >
                                    Discuss this crop with AI Agronomist <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
