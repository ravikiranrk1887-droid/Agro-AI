import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Stethoscope, Compass, Bot, User, CloudSun, PlusCircle, Leaf } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
        { path: '/fields', label: 'Farm Plots', icon: MapPin },
        { path: '/fields/new', label: 'Register New Plot', icon: PlusCircle },
        { path: '/diagnose', label: 'Multimodal Diagnosis', icon: Stethoscope },
        { path: '/recommendations', label: 'Soil Calculator', icon: Compass },
        { path: '/advisor', label: 'AI Agronomist Chat', icon: Bot },
        { path: '/profile', label: 'Farm Settings', icon: User },
    ];

    return (
        <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-4rem)] hidden lg:block p-4 flex flex-col justify-between">
            <div className="space-y-6">
                <div>
                    <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Farm Management</p>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-agri-600/20 text-agri-300 border border-agri-500/40 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-agri-400' : 'text-slate-500'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* AI System Badge Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-agri-950/60 to-slate-900/90 border border-agri-900/60 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-4 h-4 text-agri-400 animate-pulse" />
                        <span className="text-xs font-bold text-slate-200">Gemini 2.5 Active</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        Multimodal vision & soil chemistry models running real-time field risk inference.
                    </p>
                </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs px-2">
                    <CloudSun className="w-4 h-4 text-amber-400" />
                    <span>Real-time Risk Advisory On</span>
                </div>
            </div>
        </aside>
    );
}
