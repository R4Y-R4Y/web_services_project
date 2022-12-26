
import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv"
import { Database } from '../schema'

dotenv.config()

const supabaseUrl = String(process.env.SUPABASE_URL)
const supabaseKey = String(process.env.SUPABASE_ANON_KEY)

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export default supabase