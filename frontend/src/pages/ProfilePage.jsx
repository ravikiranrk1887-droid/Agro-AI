import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { User, MapPin, ShieldCheck, Mail, Save, CheckCircle, Leaf } from 'lucide-react';

export default function ProfilePage() {
    const { user, profile, updateProfile } = useAuth();
    const [fullName, setFullName] = useState(profile?.full_name || 'John Greenfield');
    const [region, setRegion] = useState(profile?.region || 'Central Valley');
    const [farmSize, setFarmSize] = useState(profile?.farm_size_hectares || '18.5');
    const [role, setRole] = useState(profile?.role || 'Farmer');
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile({
            full_name: fullName,
            region,
            farm_size_hectares: parseFloat(farmSize) || 0,
            role
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                        <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                            <User className="w-6 h-6 text-agri-400" /> Profile & Farm Account Settings
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Manage user credentials, regional preferences, and agricultural roles.</p>
                    </div>

                    {saved && (
                        <div className="flex items-center gap-2 p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Profile updated successfully!</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-agri-500/30 space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-earth-600 to-agri-700 flex items-center justify-center text-white text-xl font-bold shadow-glow">
                                {fullName ? fullName.charAt(0).toUpperCase() : 'F'}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white font-['Outfit']">{fullName}</h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {profile?.email || user?.email || 'farmer@agroadvisor.ai'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-agri-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-300 block mb-1">Platform Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-agri-500"
                                >
                                    <option value="Farmer">Farmer / Producer</option>
                                    <option value="Agronomist">Agronomist Specialist</option>
                                    <option value="Administrator">Administrator / Officer</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-300 block mb-1">Agricultural Region</label>
                                <input
                                    type="text"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-agri-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-300 block mb-1">Total Managed Hectares</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={farmSize}
                                    onChange={(e) => setFarmSize(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-agri-500"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
                            >
                                <Save className="w-4 h-4" /> Save Profile Preferences
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
