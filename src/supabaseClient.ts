import { createClient } from "@supabase/supabase-js";

let rawUrl = ((import.meta as any).env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || "").trim();

// 1. Clean trailing slash if present
if (rawUrl.endsWith("/")) {
  rawUrl = rawUrl.slice(0, -1);
}

// 1b. Strip '/rest/v1' suffix if the user accidentally copied the full REST API endpoint instead of the base Project URL
if (rawUrl.toLowerCase().endsWith("/rest/v1")) {
  rawUrl = rawUrl.substring(0, rawUrl.length - 8);
}

// Ensure trailing slash is cleaned once more if stripped
if (rawUrl.endsWith("/")) {
  rawUrl = rawUrl.slice(0, -1);
}

// 2. Help user diagnose if they copied the wrong Dashboard URL (common mistake)
if (rawUrl.includes("supabase.com/dashboard") || rawUrl.includes("/project/")) {
  console.error("🛑 Supabase URL error: You used the Dashboard URL instead of the Project API URL! Please use the 'Project URL' found under Settings -> API in Supabase (e.g., https://yourbase.supabase.co)");
}

export const supabaseUrl = rawUrl;
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Log state to aid debugging
if (isSupabaseConfigured) {
  console.log("Supabase attempts to connect using:", supabaseUrl);
} else {
  console.warn("Supabase keys are missing. Using client-side LocalStorage DB fallback.");
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

