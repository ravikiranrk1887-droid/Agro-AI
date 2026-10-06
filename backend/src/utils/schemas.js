import { z } from 'zod';

export const soilInputSchema = z.object({
  ph: z.number().min(0, "pH must be at least 0").max(14, "pH cannot exceed 14"),
  nitrogen: z.number().nonnegative("Nitrogen level must be non-negative"),
  phosphorus: z.number().nonnegative("Phosphorus level must be non-negative"),
  potassium: z.number().nonnegative("Potassium level must be non-negative"),
  temperature: z.number().min(-50, "Temperature too low").max(60, "Temperature too high"),
  humidity: z.number().min(0, "Humidity must be at least 0%").max(100, "Humidity cannot exceed 100%"),
  rainfall: z.number().nonnegative("Rainfall must be non-negative"),
  soil_type: z.string().optional(),
  region: z.string().optional()
});

export const fieldCreateSchema = z.object({
  field_name: z.string().min(1, "Field name is required"),
  crop_type: z.string().min(1, "Crop type is required"),
  soil_type: z.string().min(1, "Soil type is required"),
  area_hectares: z.number().positive("Area must be greater than zero"),
  location_lat: z.number().optional().nullable(),
  location_lng: z.number().optional().nullable(),
});

export const diagnosisInputSchema = z.object({
  crop_name: z.string().min(1, "Crop name is required"),
  field_id: z.string().optional().nullable(),
  additional_notes: z.string().optional()
});

export const chatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  session_id: z.string().optional(),
  crop_context: z.string().optional(),
  field_id: z.string().optional()
});
