
import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = String(process.env.SUPABASE_URL)
const supabaseKey = String(process.env.SUPABASE_ANON_KEY)

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase