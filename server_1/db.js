// server/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'postgresql://postgres:[hello$%Styx(&supabase921]@db.szerfvakezomcyqvxdvf.supabase.co:5432/postgres',      
  user: 'host',                        
  password: 'Styx(%&osteamproject*()',               
  database: 'Styx OS Team Project',                    
  port: 5432,
  ssl: { rejectUnauthorized: false }          
});

module.exports = pool;