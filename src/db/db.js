import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 4000,
    password: '123pailamatabiri',
    database: "solarDB"
});

export default pool;