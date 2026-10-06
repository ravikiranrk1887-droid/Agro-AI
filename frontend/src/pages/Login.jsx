import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickDemoLogin = async () => {
        setEmail('farmer.john@agroadvisor.ai');
        setPassword('password123');
        setLoading(true);
        try {
            await login('farmer.john@agroadvisor.ai', 'password123');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-agri-500/30 space-y-6 shadow-2xl">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-agri-400 flex items-center justify-center text-white mx-auto shadow-glow">
                            <Sprout className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Welcome Back</h2>
                        <p className="text-xs text-slate-400">Sign in to access your farm field logs and AI advisories.</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="farmer@agroadvisor.ai"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-agri-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-agri-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : <>Sign In to Platform <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="relative border-t border-slate-800/80 pt-4 text-center">
                        <button
                            type="button"
                            onClick={handleQuickDemoLogin}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-agri-400 border border-agri-800/60 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4" /> Sign In with Demo Farmer Account
                        </button>
                    </div>

                    <p className="text-center text-xs text-slate-400 pt-2">
                        Don't have an account? <Link to="/signup" className="text-agri-400 font-semibold hover:underline">Register Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
