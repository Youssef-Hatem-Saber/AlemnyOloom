import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { INITIAL_EXAM_QUESTIONS } from "./src/data";

dotenv.config();

const supabaseUrl = (process.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();

let url = supabaseUrl;
if (url.endsWith("/")) url = url.slice(0, -1);
if (url.toLowerCase().endsWith("/rest/v1")) url = url.substring(0, url.length - 8);
if (url.endsWith("/")) url = url.slice(0, -1);

async function run() {
  const supabase = createClient(url, supabaseAnonKey);
  console.log("Upserting questions into Supabase at URL:", url);
  const { error } = await supabase.from("ao_exam_questions").upsert(INITIAL_EXAM_QUESTIONS);
  if (error) {
    console.error("Error upserting questions:", error);
  } else {
    console.log("INITIAL_EXAM_QUESTIONS upserted to Supabase successfully!");
  }
}
run();
