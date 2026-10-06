import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FieldsList from './pages/FieldsList';
import FieldWizard from './pages/FieldWizard';
import FieldDetail from './pages/FieldDetail';
import DiagnosePage from './pages/DiagnosePage';
import RecommendationsPage from './pages/RecommendationsPage';
import AdvisorChatPage from './pages/AdvisorChatPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-agri-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Authenticated Dashboard & Feature Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/fields" element={<ProtectedRoute><FieldsList /></ProtectedRoute>} />
                <Route path="/fields/new" element={<ProtectedRoute><FieldWizard /></ProtectedRoute>} />
                <Route path="/fields/:id" element={<ProtectedRoute><FieldDetail /></ProtectedRoute>} />
                <Route path="/diagnose" element={<ProtectedRoute><DiagnosePage /></ProtectedRoute>} />
                <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
                <Route path="/advisor" element={<ProtectedRoute><AdvisorChatPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Fallback Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}
