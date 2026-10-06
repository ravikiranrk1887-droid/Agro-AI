import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Copy, Check, Leaf, MessageSquare } from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function ChatInterface({ farmContext = {}, userId }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hello! I am your AI Agronomist and Senior Agricultural Scientist. Ask me any question about plant pathology, pest control, soil fertility, or seasonal sowing strategies.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const chatEndRef = useRef(null);

    const quickPrompts = [
        "What is the best NPK fertilizer ratio for maize at tasseling stage?",
        "How do I prevent fungal rust after heavy rainfall?",
        "What organic remedies cure leaf curl virus in tomatoes?",
        "How do I balance acidic soil with pH 5.2 for soybean cultivation?"
    ];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = async (promptToSend) => {
        const text = promptToSend || input;
        if (!text.trim() || loading) return;

        const userMsg = {
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const replyText = await sendChatMessage(text, history, farmContext, userId);

            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: replyText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'I apologize, but I encountered a temporary connection issue. Please ensure your soil moisture levels remain optimal while I retry.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="glass-card rounded-2xl border border-agri-500/30 h-[650px] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-400 flex items-center justify-center text-white shadow-glow">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit']">
                            AI Agronomist Assistant <span className="text-[10px] px-2 py-0.5 rounded bg-agri-950 text-agri-400 border border-agri-800">Gemini 2.5 Pro</span>
                        </h3>
                        <p className="text-xs text-slate-400">Context: {farmContext.crop ? `${farmContext.crop} Field` : 'General Farm Advisory'}</p>
                    </div>
                </div>

                <button
                    onClick={() => setMessages([messages[0]])}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Clear Conversation"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-lg bg-agri-950 text-agri-400 border border-agri-800 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-4.5 h-4.5" />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                                msg.role === 'user'
                                    ? 'bg-gradient-to-r from-agri-600 to-agri-700 text-white rounded-tr-none'
                                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                            }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
                                <span>{msg.timestamp}</span>
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => copyToClipboard(msg.content, idx)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-agri-300"
                                    >
                                        {copiedIndex === idx ? <Check className="w-3 h-3 text-agri-400" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg bg-earth-600 text-white flex items-center justify-center flex-shrink-0 mt-1 font-bold text-xs">
                                U
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 items-center text-xs text-agri-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 w-fit">
                        <Bot className="w-4 h-4 animate-bounce" />
                        <span>AI Agronomist is reasoning field solutions...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {quickPrompts.map((qp, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(qp)}
                        className="px-3 py-1 bg-slate-900 hover:bg-agri-950 hover:border-agri-500 text-slate-300 text-[11px] rounded-full border border-slate-800 whitespace-nowrap transition-all flex-shrink-0"
                    >
                        {qp}
                    </button>
                ))}
            </div>

            {/* Input Bar */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about pest diagnosis, soil pH, crop yield, or fertilizer schedules..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-agri-500"
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white rounded-xl shadow-glow transition-all disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
