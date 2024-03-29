// const { Pool } = require('pg');
// var pool

// pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     password: '401010abc'
// })

const { Connector } = require('@google-cloud/cloud-sql-connector')
const pg = require('pg')

const { Pool } = pg;

var connector;
var pool;

var pooled = false

async function getPool(){
    if(pooled){
        return pool;
    };
    connector = new Connector();
    const clientOpts = await connector.getOptions({
        instanceConnectionName: 
            process.env.INSTANCE_CONNECTION_NAME || 'sfu-cmpt372-24spring-project:us-central1:project-pg',
        ipType: 'PUBLIC',
    });
    pool = new Pool({
        ...clientOpts,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'root',
        database: process.env.DB_NAME || 'postgres',
    });
    pooled = true;
    return pool;
}

// async function test() {
//     pool = await getPool();

//     console.log("query start");
//     const {rows} = await pool.query(`SELECT * FROM currencies`);
//     console.log("query finished");
//     console.log(rows);

//     //cleanup
//     connector.close();
//     process.exit(0);
// }

// test();

const helpers = {
    addSecurities: async function(symbol, classIn, currency) {
        let pool = await getPool();
        //Class = stocks, bonds, cash etc
        //Assume currencies already exist
        //Create new entry for unique symbol
        const sql_securities = 'INSERT INTO securities(symbol, class, currency) VALUES ($1, $2, $3) ON CONFLICT (symbol) DO NOTHING'
        const res_securities = await pool.query(sql_securities, [symbol, classIn, currency])
    },

    getSecurityHistory: async function(symbol, date) {
        let pool = await getPool();
        const sql_securities = 'SELECT * FROM securities_history WHERE symbol = $1 AND log_date = $2'
        const res_securities = await pool.query(sql_securities, [symbol, date])
        return res_securities.rows
    },

    addSecurityHistory: async function(symbol, date, open, close) {
        let pool = await getPool();
        //Act as cache for historical data, no need to query api
        const sql_securities = 'INSERT INTO securities_history (symbol, log_date, price_open, price_close) VALUES ($1, $2, $3, $4) ON CONFLICT (symbol, log_date) DO NOTHING RETURNING *'
        const res_securities = await pool.query(sql_securities, [symbol, date, open, close])
        return res_securities.rows
    },

    getAllUserHoldings: async function(user) {
        let pool = await getPool();
        const sql_allUserHoldings = 'SELECT * FROM user_holdings WHERE userid = $1'
        const res_allUserHoldings = await pool.query(sql_allUserHoldings, [user])
        return res_allUserHoldings.rows
    },

    getUserHolding: async function(user, symbol) {
        let pool = await getPool();
        const sql_userHolding = 'SELECT * FROM user_holdings WHERE userid = $1 AND symbol = $2'
        const res_userHolding = await pool.query(sql_userHolding, [user, symbol])
        return res_userHolding.rows
    },

    addUserHolding: async function(user, symbol, quantity, cost_basis, currency) {
        let pool = await getPool();
        const sql_userHolding = 'INSERT INTO user_holdings (userid, symbol, quantity, cost_basis, currency) VALUES ($1, $2, $3, $4, $5) RETURNING *'
        const res_userHolding = await pool.query(sql_userHolding, [user, symbol, quantity, cost_basis, currency])
        return res_userHolding.rows
    },

    updateUserHolding: async function(user, symbol, quantity, cost_basis) {
        let pool = await getPool();
        const sql_userHolding = 'UPDATE user_holdings SET quantity=$3, cost_basis=$4 WHERE userid=$1 AND symbol=$2 RETURNING *'
        const res_userHolding = await pool.query(sql_userHolding, [user, symbol, quantity, cost_basis])
        return res_userHolding.rows
    },

    getUser: async function(user) {
        let pool = await getPool();
        const sql_userHolding = 'SELECT * from users WHERE userid=$1'
        const res_userHolding = await pool.query(sql_userHolding, [user])
        return res_userHolding.rows
    },

    getAllUsers: async function() {
        const sql_userHolding = 'SELECT userid from users'
        const res_userHolding = await pool.query(sql_userHolding)
        return res_userHolding.rows
    },

    addUser: async function(userid,role, pass, manager) {
        const sql_userHolding = 'INSERT INTO users (userid, role_name, password_hash, manager_id) VALUES ($1, $2, $3, $4) RETURNING *'
        const res_userHolding = await pool.query(sql_userHolding, [userid, role, pass, manager])
        return res_userHolding.rows
    },

    distinctUserFromHoldings: async function() {
        const sql_userHolding = 'SELECT DISTINCT userid FROM user_holdings'
        const res_userHolding = await pool.query(sql_userHolding)
        return res_userHolding.rows
    },
}

module.exports = { helpers }
