import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Leaf, FlaskConical, Stethoscope, ArrowRight, Download } from 'lucide-react';

export default function DiagnosisCard({ diagnosis, onAskAdvisor, onExportPdf }) {
    if (!diagnosis) return null;

    const {
        crop_name,
        detected_issue,
        confidence_score,
        severity,
        symptoms = [],
        treatment_plan = {},
        image_url
    } = diagnosis;

    const organic = treatment_plan.organic || [];
    const chemical = treatment_plan.chemical || [];
    const preventative = treatment_plan.preventative || [];

    const getSeverityBadge = (level) => {
        switch (level) {
            case 'High':
                return 'bg-red-950/80 text-red-400 border-red-800/80';
            case 'Moderate':
                return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
            default:
                return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
        }
    };

    return (
        <div className="glass-card rounded-2xl p-6 border border-agri-500/30 space-y-6 relative overflow-hidden">
            {/* Header section with severity and confidence */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div className="flex items-start gap-4">
                    {image_url && (
                        <img
                            src={image_url}
                            alt={detected_issue}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-700 shadow-md flex-shrink-0"
                        />
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-agri-400 uppercase tracking-wider">{crop_name} Diagnosis</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityBadge(severity)}`}>
                                {severity} Severity
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1 font-['Outfit']">{detected_issue}</h3>
                    </div>
                </div>

                {/* Confidence Meter */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-center min-w-[180px]">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-slate-400">Model Confidence</span>
                        <span className="text-agri-400 font-bold">{confidence_score}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-agri-500 to-agri-300 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${confidence_score}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Symptoms Checklist */}
            {symptoms.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-agri-400" /> Observed Pathological Symptoms
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span>{symptom}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Organic & Chemical Treatments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic Treatment */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-emerald-400" /> Organic & Biological Controls
                    </h4>
                    <ul className="space-y-2">
                        {organic.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chemical Treatment */}
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-blue-400" /> Recommended Fungicide / Insecticide
                    </h4>
                    <ul className="space-y-2">
                        {chemical.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Preventative Measures */}
            {preventative.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-agri-400" /> Preventative & Crop Rotation Protocols
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {preventative.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-agri-400 mt-1.5 flex-shrink-0"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                {onExportPdf && (
                    <button
                        onClick={onExportPdf}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all"
                    >
                        <Download className="w-4 h-4 text-slate-400" /> Export PDF Advisory Report
                    </button>
                )}
                {onAskAdvisor && (
                    <button
                        onClick={onAskAdvisor}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-semibold rounded-lg shadow-glow transition-all ml-auto"
                    >
                        Ask AI Agronomist Follow-up <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
