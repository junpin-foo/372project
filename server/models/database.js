const { Pool } = require('pg');
var pool

pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '401010abc'
})

const helpers = {
    addSecurities: async function(symbol, classIn, currency) {
        //Class = stocks, bonds, cash etc
        //Assume currencies already exist
        //Create new entry for unique symbol
        const sql_securities = 'INSERT INTO securities(symbol, class, currency) VALUES ($1, $2, $3) ON CONFLICT (symbol) DO NOTHING'
        const res_securities = await pool.query(sql_securities, [symbol, classIn, currency])
    },

    getSecurityHistory: async function(symbol, date) {
        const sql_securities = 'SELECT * FROM securities_history WHERE symbol = $1 AND log_date = $2'
        const res_securities = await pool.query(sql_securities, [symbol, date])
        return res_securities.rows
    },

    addSecurityHistory: async function(symbol, date, open, close, high, low) {
        //Act as cache for historical data, no need to query api
        const sql_securities = 'INSERT INTO securities_history (symbol, log_date, price_open, price_close, price_high, price_low) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        const res_securities = await pool.query(sql_securities, [symbol, date, open, close, high, low])
        return res_securities.rows
    },
}

module.exports = { helpers }