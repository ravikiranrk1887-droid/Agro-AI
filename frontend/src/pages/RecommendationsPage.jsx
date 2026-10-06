import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SoilForm from '../components/SoilForm';
import RecommendationTable from '../components/RecommendationTable';
import { submitSoilRecommendation } from '../services/api';
import { Compass, AlertCircle, RefreshCw } from 'lucide-react';

export default function RecommendationsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFormSubmit = async (soilParams) => {
        setError('');
        setLoading(true);
        try {
            const res = await submitSoilRecommendation(soilParams, user?.id);
            setRecommendations(res.recommendation?.recommended_crops || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCrop = (crop) => {
        navigate('/advisor', {
            state: {
                initialMessage: `I am planning to plant ${crop.crop_name} which has a suitability score of ${crop.suitability_score}%. Can you provide detailed sowing calendars and pest management tips?`
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                            <Compass className="w-6 h-6 text-agri-400" />
                            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Smart Crop & Soil Recommendation Engine</h1>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Calculate top crop suitability matches, expected yield tons/ha, and fertilizer top-dressing schedules using Gemini.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3.5 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <SoilForm onSubmit={handleFormSubmit} loading={loading} />

                    {recommendations && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white font-['Outfit']">Gemini Recommendation Results</h2>
                                <button
                                    onClick={() => setRecommendations(null)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg border border-slate-800"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 text-agri-400" /> Reset Parameters
                                </button>
                            </div>

                            <RecommendationTable
                                recommendations={recommendations}
                                onSelectCrop={handleSelectCrop}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
