-- Supabase Initial Schema for AI-Powered Agriculture Crop Advisory Assistant
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'Farmer' CHECK (role IN ('Farmer', 'Agronomist', 'Administrator')),
    region TEXT NOT NULL,
    farm_size_hectares NUMERIC(10,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Farm Fields Table
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    field_name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    area_hectares NUMERIC(10,2) NOT NULL,
    location_lat NUMERIC(10,6),
    location_lng NUMERIC(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Crop Diagnoses Table
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    detected_issue TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Moderate', 'High')),
    symptoms JSONB DEFAULT '[]'::jsonb,
    treatment_plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Recommendations Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    soil_data JSONB NOT NULL,
    recommended_crops JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. AI Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT DEFAULT 'Agronomic Consultation',
    messages JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON public.fields(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_user_id ON public.diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_field_id ON public.diagnoses(field_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-applying
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can manage own diagnoses" ON public.diagnoses;
DROP POLICY IF EXISTS "Users can manage own recommendations" ON public.recommendations;
DROP POLICY IF EXISTS "Users can manage own chat sessions" ON public.chat_sessions;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own fields" ON public.fields FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own diagnoses" ON public.diagnoses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recommendations" ON public.recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);

-- Auto-profile Creation Trigger on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, region, farm_size_hectares)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agri Farmer'),
        COALESCE(NEW.raw_user_meta_data->>'region', 'Central Valley'),
        COALESCE((NEW.raw_user_meta_data->>'farm_size_hectares')::NUMERIC, 5.0)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed Data (Sample entries for offline/local demonstration mode or direct database preview)
-- Note: Seed data uses a fallback placeholder UUID if needed or gets inserted during testing
