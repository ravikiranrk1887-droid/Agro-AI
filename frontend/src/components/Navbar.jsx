import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LayoutDashboard, MapPin, Stethoscope, Compass, Bot, User, LogOut, ChevronDown, ShieldCheck, Leaf } from 'lucide-react';

export default function Navbar() {
    const { user, profile, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/fields', label: 'Farm Plots', icon: MapPin },
        { path: '/diagnose', label: 'Multimodal Diagnosis', icon: Stethoscope },
        { path: '/recommendations', label: 'Soil Calculator', icon: Compass },
        { path: '/advisor', label: 'AI Agronomist', icon: Bot },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo & Brand */}
                <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
                        <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">Agro<span className="text-gradient">Advisor</span></span>
                        <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-agri-950/80 text-agri-400 border border-agri-800/50 rounded-md">Gemini 2.5</span>
                    </div>
                </Link>

                {/* Navigation Links for Authenticated Users */}
                {user && (
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-agri-600/20 text-agri-300 border border-agri-500/30'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-agri-400' : 'text-slate-400'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {/* User Profile / Auth Action */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-left"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-earth-600 to-agri-700 flex items-center justify-center text-white text-xs font-bold">
                                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'F'}
                                </div>
                                <div className="hidden sm:block leading-tight pr-1">
                                    <p className="text-xs font-semibold text-slate-200">{profile?.full_name || 'Farmer User'}</p>
                                    <p className="text-[10px] text-agri-400 flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        {profile?.role || 'Farmer'}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-2xl py-2 z-50 border border-slate-700/80">
                                    <div className="px-4 py-2 border-b border-slate-800">
                                        <p className="text-xs text-slate-400">Signed in as</p>
                                        <p className="text-xs font-medium text-slate-200 truncate">{profile?.email || user?.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                    >
                                        <User className="w-4 h-4 text-agri-400" />
                                        Profile & Farm Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link to="/signup" className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white rounded-lg shadow-glow transition-all">
                                Get Started Free
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
