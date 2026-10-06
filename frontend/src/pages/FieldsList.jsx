import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchFields } from '../services/api';
import { MapPin, PlusCircle, Sprout, ArrowRight, Layers, Globe } from 'lucide-react';

export default function FieldsList() {
    const { user } = useAuth();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFields = async () => {
            try {
                const data = await fetchFields(user?.id);
                setFields(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadFields();
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-agri-400" /> Managed Farm Fields
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">Geo-tagged plots, crop history, soil profiles, and yield logs.</p>
                        </div>

                        <Link
                            to="/fields/new"
                            className="px-4 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-2 self-start sm:self-auto"
                        >
                            <PlusCircle className="w-4 h-4" /> Register New Plot Wizard
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="glass-card h-40 rounded-2xl animate-pulse bg-slate-900/60 p-4"></div>
                            ))}
                        </div>
                    ) : fields.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fields.map(field => (
                                <div
                                    key={field.id}
                                    className="glass-card glass-card-hover rounded-2xl p-5 border border-agri-500/30 flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-agri-400 tracking-wider">Field Plot</span>
                                                <h3 className="text-lg font-bold text-white font-['Outfit']">{field.field_name}</h3>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full bg-agri-950 text-agri-300 border border-agri-800 text-xs font-mono font-bold">
                                                {field.area_hectares} Ha
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">Primary Crop</span>
                                                <span className="font-semibold text-slate-200 flex items-center gap-1">
                                                    <Sprout className="w-3.5 h-3.5 text-agri-400" /> {field.crop_type}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">Soil Profile</span>
                                                <span className="font-semibold text-slate-200 flex items-center gap-1">
                                                    <Layers className="w-3.5 h-3.5 text-earth-400" /> {field.soil_type}
                                                </span>
                                            </div>
                                        </div>

                                        {field.location_lat && (
                                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Globe className="w-3 h-3 text-slate-500" /> Coordinates: {field.location_lat}, {field.location_lng}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-800">
                                        <Link
                                            to={`/fields/${field.id}`}
                                            className="flex items-center justify-between text-xs font-semibold text-agri-400 hover:text-agri-300 transition-colors"
                                        >
                                            View Historical Advisories & Forecast <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-slate-800">
                            <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
                            <h3 className="text-lg font-bold text-white">No Farm Plots Registered</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">Create your first field plot to track soil test logs, crop health diagnoses, and localized microclimate weather alerts.</p>
                            <Link
                                to="/fields/new"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 text-white text-xs font-bold rounded-xl shadow-glow"
                            >
                                <PlusCircle className="w-4 h-4" /> Start Registration Wizard
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
