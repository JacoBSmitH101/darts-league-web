const { Pool } = require("pg");
//initialise dotenv
require("dotenv").config();
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected");
        console.log(res.rows);
    }
});
const query = (text, params) => pool.query(text, params);
//make the above with module.exports
module.exports = {
    query,
};
