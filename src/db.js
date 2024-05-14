const {Pool} = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 4000,
    password: '123pailamatabiri',
    database: "solarDB"
});

module.exports = pool;