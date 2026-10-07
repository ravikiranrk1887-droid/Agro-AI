# AI-Powered Agriculture Crop Advisory Assistant (AgroAdvisor AI)

Production-grade, end-to-end, highly scalable web application providing real-time agricultural guidance, multimodal plant pathology diagnosis, soil chemistry & N-P-K recommendation calculation, localized weather risk modeling, and multi-turn AI agronomic consultation using the `@google/genai` SDK and Supabase PostgreSQL with Row Level Security (RLS).

## 🌐 Live Demo

> **Frontend (Vercel):** [https://agro-a8ax88y2b-ravikiranrk1887-9832s-projects.vercel.app](https://agro-a8ax88y2b-ravikiranrk1887-9832s-projects.vercel.app)

---


## 🌟 Key Features

1. **Multimodal Crop Health Pathologist (`/diagnose`)**
   - Upload leaf/foliage images (JPEG, PNG, WebP up to 10MB) or use preset crop leaf photos.
   - Leverages `gemini-2.5-flash` to identify pests, fungal/bacterial blights, and nutrient deficiencies.
   - Structured output with model confidence score, severity rating (Low, Moderate, High), organic remedies, chemical controls with dosages, and crop rotation protocols.

2. **Smart Crop & Soil Recommendation Engine (`/recommendations`)**
   - Multi-parameter form (pH, Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Rainfall, Soil Type).
   - Instant calculation of top 3 optimal crop matches, expected yield (Tons/Hectare), and split fertilizer top-dressing schedules.
   - Soil profile presets (Alluvial, Black Regur, Red Laterite, Sandy Loam).

3. **Interactive Farm Field Management (`/fields`, `/fields/new`, `/fields/:id`)**
   - Geo-tagged farm plots with latitude/longitude coordinates, acreage tracking, and crop history.
   - Historical diagnostic inspection logs per plot.

4. **Localized Weather Risk Advisory (`/weather`)**
   - Real-time microclimate risk modeling assessing Frost warnings, Drought threats, High Fungal Spore risk, and Waterlogging.

5. **AI Agronomist Chatbot (`/advisor`)**
   - Multi-turn conversational interface powered by `gemini-2.5-pro`.
   - Context injection with user farm field, crop type, and soil profile.
   - Quick prompt chips and speech/copy support.

6. **Exportable Advisory Reports**
   - PDF export generation for crop diagnosis reports.

7. **Security & Data Isolation**
   - Row Level Security (RLS) on all Supabase PostgreSQL tables (`profiles`, `fields`, `diagnoses`, `recommendations`, `chat_sessions`).
   - Zod runtime schema validation on both client and server API endpoints.
   - Server-side rate limiting (max 20 req/min per IP on AI routes).

---

## 🏗️ Technology Stack

- **Frontend:** React 18 (Vite), Tailwind CSS, Lucide React Icons, React Router DOM v6, jsPDF.
- **Backend:** Node.js, Express.js, `@google/genai` SDK, `@supabase/supabase-js`, Zod, Multer.
- **Database:** Supabase PostgreSQL with UUID primary keys, foreign key constraints, indexes, and RLS policies.

---

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` in `backend/` and root:
```bash
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-google-genai-api-key
FRONTEND_URL=http://localhost:5173
```

### 2. Database Migrations

Apply the database schema to Supabase using the included migration runner:
```bash
node supabase/apply-migrations.js
```
*Note: SQL schema script is stored in `/supabase/migrations/001_initial_schema.sql`.*

### 3. Run Backend Express Server

```bash
cd backend
npm install
npm run dev
```

### 4. Run Frontend Vite App

```bash
cd frontend
npm install
npm run dev
```

Visit app at `http://localhost:5173`.
