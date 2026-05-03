import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const SUPABASE_PHOTO_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PHOTO_BUCKET || "player-photos";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
