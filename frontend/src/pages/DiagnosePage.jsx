import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ImageUploader from '../components/ImageUploader';
import DiagnosisCard from '../components/DiagnosisCard';
import { submitDiagnosis } from '../services/api';
import { exportDiagnosisPdf } from '../utils/reportExporter';
import { Stethoscope, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function DiagnosePage() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [cropName, setCropName] = useState('Maize / Corn');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [error, setError] = useState('');

    const cropOptions = [
        'Maize / Corn',
        'Soybean',
        'Wheat',
        'Rice (Paddy)',
        'Cotton',
        'Chickpea',
        'Tomato',
        'Potato',
        'Sugarcane',
        'Citrus / Orange'
    ];

    const handleImageSelect = (file, url, suggestedCrop) => {
        setSelectedFile(file);
        setPreviewUrl(url);
        if (suggestedCrop) {
            const matched = cropOptions.find(c => c.toLowerCase().includes(suggestedCrop.toLowerCase()));
            if (matched) setCropName(matched);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            if (selectedFile) {
                formData.append('image', selectedFile);
            } else if (previewUrl) {
                formData.append('image_url', previewUrl);
            }
            formData.append('crop_name', cropName);
            formData.append('additional_notes', additionalNotes);

            const res = await submitDiagnosis(formData, user?.id);
            setDiagnosisResult(res.diagnosis);
        } catch (err) {
            setError(err.message || 'Failed to complete multimodal diagnosis');
        } finally {
            setLoading(false);
        }
    };

    const handleAskAdvisor = () => {
        navigate('/advisor', {
            state: {
                initialMessage: `I recently ran a diagnosis on my ${cropName} crop which detected: ${diagnosisResult?.detected_issue}. Can you give me detailed application rates for the treatment?`
            }
        });
    };

    const handleExport = () => {
        if (diagnosisResult) {
            exportDiagnosisPdf(diagnosisResult, profile?.full_name || 'Agri Farmer');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="w-6 h-6 text-agri-400" />
                            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Multimodal Crop Health Pathologist</h1>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Upload foliage photographs for instant computer vision analysis via Google Gemini 2.5 Flash.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3.5 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {!diagnosisResult ? (
                        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-agri-500/30 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-300 block">Step 1: Upload Leaf / Foliage Photograph</label>
                                <ImageUploader onImageSelected={handleImageSelect} selectedImagePreview={previewUrl} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">Step 2: Select Crop Species</label>
                                    <select
                                        value={cropName}
                                        onChange={(e) => setCropName(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:border-agri-500"
                                    >
                                        {cropOptions.map((c, i) => (
                                            <option key={i} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">Additional Symptoms / Context (Optional)</label>
                                    <input
                                        type="text"
                                        value={additionalNotes}
                                        onChange={(e) => setAdditionalNotes(e.target.value)}
                                        placeholder="e.g. Yellow lesions appearing after 3 days of rain"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-agri-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || (!selectedFile && !previewUrl)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Gemini Vision Analyzing Foliage...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 text-amber-400" /> Run AI Multimodal Diagnosis
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white font-['Outfit']">Analysis Completed</h2>
                                <button
                                    onClick={() => {
                                        setDiagnosisResult(null);
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg border border-slate-800"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 text-agri-400" /> Run New Diagnosis
                                </button>
                            </div>

                            <DiagnosisCard
                                diagnosis={diagnosisResult}
                                onAskAdvisor={handleAskAdvisor}
                                onExportPdf={handleExport}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
