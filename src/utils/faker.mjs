import {faker} from '@faker-js/faker'
import dotenv from "dotenv"
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabaseUrl = "https://wkqtxpkrcftuxatcbwka.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcXR4cGtyY2Z0dXhhdGNid2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIwMTg0ODgsImV4cCI6MTk4NzU5NDQ4OH0.NvuyGddhjEwQQWfabjYjBByMHR-lE_7ldT7SHuqiXX4"

const supabase = createClient(supabaseUrl, supabaseKey)
dotenv.config()

var request
try {
    request = await supabase.from("Platform").insert([{
        name: faker.company.name(),
        link: faker.internet.url(),
        description: faker.company.bs()
    }])
    
    if(request.error) throw request.error
    console.log(request.data)
} catch (error) {
    console.log(error)
}
