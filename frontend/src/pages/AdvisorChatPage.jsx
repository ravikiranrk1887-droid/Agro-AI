import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import { fetchFields } from '../services/api';
import { Bot, MapPin, Sprout } from 'lucide-react';

export default function AdvisorChatPage() {
    const { user } = useAuth();
    const location = useLocation();
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);

    useEffect(() => {
        const loadFields = async () => {
            try {
                const data = await fetchFields(user?.id);
                setFields(data);
                if (data.length > 0) {
                    setSelectedField(data[0]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadFields();
    }, [user]);

    const farmContext = selectedField ? {
        field_name: selectedField.field_name,
        crop: selectedField.crop_type,
        soil_type: selectedField.soil_type
    } : {};

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Bot className="w-6 h-6 text-agri-400" />
                                <h1 className="text-2xl font-extrabold text-white font-['Outfit']">AI Agronomist Multi-Turn Consultation</h1>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Deep agronomic reasoning powered by Google Gemini 2.5 Pro.
                            </p>
                        </div>

                        {fields.length > 0 && (
                            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                                <MapPin className="w-4 h-4 text-agri-400" />
                                <span className="text-slate-400">Target Field:</span>
                                <select
                                    value={selectedField?.id || ''}
                                    onChange={(e) => {
                                        const f = fields.find(item => item.id === e.target.value);
                                        setSelectedField(f);
                                    }}
                                    className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                                >
                                    {fields.map(f => (
                                        <option key={f.id} value={f.id}>{f.field_name} ({f.crop_type})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <ChatInterface farmContext={farmContext} userId={user?.id} />
                </main>
            </div>
        </div>
    );
}
