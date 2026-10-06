import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Sparkles } from 'lucide-react';

export default function ImageUploader({ onImageSelected, selectedImagePreview }) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');

    const sampleImages = [
        {
            name: 'Maize Blight Leaf',
            url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=800&q=80',
            crop: 'Maize'
        },
        {
            name: 'Soybean Rust Leaf',
            url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
            crop: 'Soybean'
        },
        {
            name: 'Tomato Spot Infection',
            url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=80',
            crop: 'Tomato'
        }
    ];

    const validateFile = (file) => {
        if (!file) return false;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a JPEG, PNG, or WebP image.');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Image size exceeds 10MB limit.');
            return false;
        }
        setError('');
        return true;
    };

    const handleFile = (file) => {
        if (validateFile(file)) {
            const previewUrl = URL.createObjectURL(file);
            onImageSelected(file, previewUrl);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const selectSample = async (sample) => {
        try {
            const res = await fetch(sample.url);
            const blob = await res.blob();
            const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, '-')}.jpg`, { type: 'image/jpeg' });
            onImageSelected(file, sample.url, sample.crop);
            setError('');
        } catch (err) {
            onImageSelected(null, sample.url, sample.crop);
        }
    };

    return (
        <div className="space-y-4">
            {selectedImagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-agri-500/40 shadow-glow bg-slate-900 group">
                    <img
                        src={selectedImagePreview}
                        alt="Crop leaf sample preview"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => onImageSelected(null, null)}
                            className="p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-500 transition-transform hover:scale-110"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/90 text-agri-400 px-3 py-1 rounded-lg text-xs font-semibold border border-slate-700/80 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" /> Image Ready for Multimodal Analysis
                    </div>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                        dragActive
                            ? 'border-agri-400 bg-agri-950/40 scale-[0.99]'
                            : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                    }`}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-agri-950/80 text-agri-400 flex items-center justify-center border border-agri-800/60 shadow-glow">
                            <UploadCloud className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-200">
                                Drag & drop leaf/crop photo or <span className="text-agri-400 underline">browse</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Supports JPEG, PNG, WebP up to 10MB</p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Quick Sample Image Selectors */}
            {!selectedImagePreview && (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-400">Or try a sample diseased leaf photo:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {sampleImages.map((sample, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => selectSample(sample)}
                                className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-agri-500/50 text-left transition-all hover:bg-slate-800/60 group"
                            >
                                <img src={sample.url} alt={sample.name} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-slate-300 truncate group-hover:text-agri-300">{sample.name}</p>
                                    <p className="text-[10px] text-slate-400">{sample.crop}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
