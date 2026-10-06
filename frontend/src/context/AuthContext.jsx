import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Default mock user profile when operating in test/offline mode
    const defaultDemoProfile = {
        id: 'demo-user-123',
        email: 'farmer.john@agroadvisor.ai',
        full_name: 'John Greenfield',
        role: 'Farmer',
        region: 'Central Valley Agronomic District',
        farm_size_hectares: 18.5
    };

    useEffect(() => {
        if (!isSupabaseConfigured) {
            // Use high-fidelity local session fallback
            const savedUser = localStorage.getItem('agri_demo_user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                setProfile(parsed);
            } else {
                setUser(defaultDemoProfile);
                setProfile(defaultDemoProfile);
            }
            setLoading(false);
            return;
        }

        // Supabase Auth listener
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        };

        getInitialSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data && !error) {
                setProfile(data);
            } else {
                setProfile({
                    id: userId,
                    full_name: user?.user_metadata?.full_name || 'Agri Farmer',
                    role: 'Farmer',
                    region: user?.user_metadata?.region || 'Central Valley',
                    farm_size_hectares: 10
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        if (!isSupabaseConfigured) {
            const demoUser = {
                id: 'demo-user-123',
                email: email || 'farmer.john@agroadvisor.ai',
                full_name: email ? email.split('@')[0] : 'John Greenfield',
                role: 'Farmer',
                region: 'Central Valley Agronomic District',
                farm_size_hectares: 18.5
            };
            localStorage.setItem('agri_demo_user', JSON.stringify(demoUser));
            setUser(demoUser);
            setProfile(demoUser);
            return { success: true };
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signup = async (email, password, fullName, region, farmSize, role = 'Farmer') => {
        if (!isSupabaseConfigured) {
            const newUser = {
                id: `user-${Date.now()}`,
                email,
                full_name: fullName,
                role,
                region,
                farm_size_hectares: parseFloat(farmSize) || 5.0
            };
            localStorage.setItem('agri_demo_user', JSON.stringify(newUser));
            setUser(newUser);
            setProfile(newUser);
            return { success: true };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    region: region,
                    farm_size_hectares: parseFloat(farmSize) || 5.0,
                    role: role
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        if (!isSupabaseConfigured) {
            localStorage.removeItem('agri_demo_user');
            setUser(null);
            setProfile(null);
            return;
        }
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    const updateProfile = async (updatedData) => {
        const newProf = { ...profile, ...updatedData };
        setProfile(newProf);
        if (!isSupabaseConfigured) {
            localStorage.setItem('agri_demo_user', JSON.stringify(newProf));
            return;
        }
        if (user) {
            await supabase.from('profiles').update(updatedData).eq('id', user.id);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
