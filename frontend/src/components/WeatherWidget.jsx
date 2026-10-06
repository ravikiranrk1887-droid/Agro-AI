import React, { useEffect, useState } from 'react';
import { CloudSun, Thermometer, Droplets, Wind, CloudRain, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { fetchWeatherRisk } from '../services/api';

export default function WeatherWidget({ lat = 36.778261, lng = -119.417931 }) {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadWeather = async () => {
        setLoading(true);
        try {
            const data = await fetchWeatherRisk(lat, lng);
            setWeatherData(data);
        } catch (err) {
            console.error('Weather load error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWeather();
    }, [lat, lng]);

    if (loading) {
        return (
            <div className="glass-card rounded-2xl p-5 border border-agri-500/20 animate-pulse space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-10 bg-slate-800 rounded w-full"></div>
            </div>
        );
    }

    if (!weatherData) return null;

    const { current, risk_summary } = weatherData;
    const isHighRisk = risk_summary.level === 'High';

    return (
        <div className={`glass-card rounded-2xl p-5 border transition-all ${
            isHighRisk ? 'border-amber-500/40 bg-amber-950/10' : 'border-agri-500/30'
        }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                    <CloudSun className="w-5 h-5 text-amber-400" />
                    <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Localized Weather Risk Advisory</h4>
                        <p className="text-[10px] text-slate-400">Microclimate Monitoring ({lat.toFixed(2)}°, {lng.toFixed(2)}°)</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        risk_summary.level === 'High'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : risk_summary.level === 'Moderate'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                        {risk_summary.level} Risk
                    </span>
                    <button onClick={loadWeather} className="p-1 text-slate-400 hover:text-white">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Current Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Thermometer className="w-3 h-3 text-amber-400" /> Temp
                    </div>
                    <p className="text-sm font-bold text-white">{current.temp}°C</p>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Droplets className="w-3 h-3 text-blue-400" /> Humidity
                    </div>
                    <p className="text-sm font-bold text-white">{current.humidity}%</p>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Wind className="w-3 h-3 text-teal-400" /> Wind
                    </div>
                    <p className="text-sm font-bold text-white">{current.wind_speed_kmh} <span className="text-[10px] font-normal">km/h</span></p>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <CloudRain className="w-3 h-3 text-cyan-400" /> Rain
                    </div>
                    <p className="text-sm font-bold text-white">{current.rainfall_mm} <span className="text-[10px] font-normal">mm</span></p>
                </div>
            </div>

            {/* Risk Alerts */}
            {risk_summary.alerts && risk_summary.alerts.length > 0 ? (
                <div className="space-y-2">
                    {risk_summary.alerts.map((alert, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-amber-300 mr-1.5">{alert.type}:</span>
                                <span className="text-slate-300">{alert.details}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/40">
                    <CheckCircle className="w-4 h-4" />
                    <span>No critical weather threats detected for your farm location.</span>
                </div>
            )}

            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                💡 <span className="font-medium text-slate-300">Action:</span> {risk_summary.recommendation}
            </p>
        </div>
    );
}
