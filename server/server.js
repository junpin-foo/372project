const express = require('express')
const api = require('./Polygon/apiHelpers')
const db = require('./models/database')
const PORT = 3001;
const cors = require('cors')
const session = require('express-session')
const createHttpError = require("http-errors");
const bcrypt = require('bcryptjs');
const moment = require('moment');

const app = express()

app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

app.use(cors({
    origin: "http://localhost:3000", // allow all origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials:true
 }))

app.use(session({
    name: 'nsession',
    secret: 'secret_string',
    resave: false,
    saveUninitialized: false,
    maxAge: 1000*60*60, 
    cookie:{
        secure:false

    }
}))


function isLoggedIn(req, res, next) {
    console.log(req.session.user)
    if (req.session.user) {
        next()
    } else {
        res.redirect('/')
    }
}
app.get('/getAllUsers', async(req,res) => {
    var users = (await db.helpers.getAllUsers("user"))

    res.json(users)
})

app.post('/signup', async(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const manager = req.body.manager;
    const role = req.body.role;
    console.log(password)
    var users = (await db.helpers.addUser(username, role,password,manager))

    res.status(200).json({ message: 'Signup successful' }); 
})
app.post('/login', async(req,res) => {

    const username = req.body.username;
    const password = req.body.password;
    user = {username: username, password: password}
    var dataUser = (await db.helpers.getUser(username))[0]
    const dbUsername = dataUser["userid"]
    var dbPass = dataUser["password_hash"]

    if(username=== dbUsername && bcrypt.compareSync(password, dbPass)){
        
        req.session.user = {...user, role: dataUser["role_name"]}
        res.status(200).json({ message: dataUser["role_name"]}); 
    }
    else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
})

app.post("/submitMoneyForm", async (req, res, next) => {
    //User form data
    let transaction = req.body.transaction //withdraw / deposit
    let currency = req.body.currency
    let amount = Number(req.body.amount)

    let user = req.session.user.username

    console.log(req.body)

    //**Ensure cash is auto created when user created**
    //symbol = USD/CAD, Quantity = 1, cash_basis = value
    let user_holding_cash = await db.helpers.getUserHolding(user, currency)

    //If no CASH entry create one
    if(JSON.stringify(user_holding_cash) === '[]') {
        //Initialize new entry - for cash
        user_holding = await db.helpers.addUserHolding(user, "USD", 1, 0, currency)
    }

    if(transaction == "deposit") {
        let current_cash = Number(user_holding_cash[0].cost_basis)
        let new_cash = current_cash + amount;
        let user_holding_sell_cash = await db.helpers.updateUserHolding(user, "USD", 1, new_cash)

    } 
    else if (transaction == "withdraw") {
        let current_cash = Number(user_holding_cash[0].cost_basis)
        let new_cash = current_cash - amount;
        if(new_cash < 0) {
            const error = createHttpError(400, "Insufficient funds!", {
                headers: {
                    "X-Custom-Header": "Value"
                }
            });
            return next(error);
        }
        let user_holding_sell_cash = await db.helpers.updateUserHolding(user, "USD", 1, new_cash)

    }
    res.status(204).send();
})

app.post("/submitTransactionForm", async (req, res, next) => {
    //User form data
    let transaction = req.body.transaction //Bought OR Sold
    let ticker_symbol = req.body.tickerSymbol
    let ticker_class = req.body.tickerClass
    let ticker_currency = req.body.tickerCurrency
    let quantity = Number(req.body.quantity)
    let price = req.body.price
    let date = req.body.date

    let user;
    if(req.session.user.role = "manager"){
        user = req.body.onBehalfOf
    }
    else{
        user = req.session.user.username
    }

    //Insert into securities table if not exist
    await db.helpers.addSecurities(ticker_symbol, ticker_class, ticker_currency)

    //Call Polygon api to check if symbol is valid
    let data = await api.polygonApiHelpers.getStockOpenClose(ticker_symbol, date)
    if (data.status == "NOT_FOUND" || data.status == "ERROR") {
        const error = createHttpError(406, "Invalid Symbol!", {
            headers: {
                "X-Custom-Header": "Value"
            }
        });
        return next(error);
    }

    //Check if we have this ticker closing price cached in DB
    let p = await db.helpers.getSecurityHistory(ticker_symbol, date)
    if(JSON.stringify(p) === '[]') {
        //Add into DB for cache
        p = await db.helpers.addSecurityHistory(ticker_symbol, date, data.open, data.close)
    }

    let user_holding = await db.helpers.getUserHolding(user, ticker_symbol)
    //**Ensure cash is auto created when user created**
    //symbol = USD/CAD, Quantity = 1, cash_basis = value
    let user_holding_cash = await db.helpers.getUserHolding(user, "USD")

    //If no CASH entry create one
    if(JSON.stringify(user_holding_cash) === '[]') {
        //Initialize new entry - for cash
        user_holding = await db.helpers.addUserHolding(user, "USD", 1, 0, ticker_currency)
    }

    //User does not hold this symbol yet
    if(JSON.stringify(user_holding) === '[]') {
        //Initialize new entry - update on buy/sell later
        user_holding = await db.helpers.addUserHolding(user, ticker_symbol, 0, 0, ticker_currency)
    }

    //Do profit/loss calculation
    let profit = 0; //positive number
    let loss = 0; //nagtive number
    let value = (quantity * price) - (quantity * p[0].price_close); //user bought price - closing price in DB
    console.log("value: " + value )
    let current_quantity = Number(user_holding[0].quantity);
    let current_cost_basis = Number(user_holding[0].cost_basis);

    if(transaction == "buy") {
        let current_cash = Number(user_holding_cash[0].cost_basis)
        let new_cash = current_cash - (price*quantity);
        try {
            if(new_cash < 0) {
                throw new Exception("Insufficient funds")
            }
            let user_holding_sell_cash = await db.helpers.updateUserHolding(user, "USD", 1, new_cash)

            //If buy add to user_holdings
            let new_quantity = current_quantity + quantity;
            console.log("form quantity: " + typeof quantity )
            console.log("current quantity: " + typeof current_quantity)
            let new_cost_basis = ((current_cost_basis*current_quantity) + (price*quantity)) / new_quantity;
            console.log("New cost basis: " + new_cost_basis)

            let user_holding_buy = await db.helpers.updateUserHolding(user, ticker_symbol, new_quantity, new_cost_basis)
            value > 0? loss+= (value * -1) : profit += (value * -1) // (+) => lost value, (-) => profit value && (*-1 to normalize)
        }catch{
            const error = createHttpError(400, "Insufficient funds!", {
                headers: {
                    "X-Custom-Header": "Value"
                }
            });
            return next(error);
        }
    } else {
        let new_quantity = current_quantity - quantity;

        //If sell, update user_holdings
        let user_holding_sell = await db.helpers.updateUserHolding(user, ticker_symbol, new_quantity, current_cost_basis, ticker_currency)
        value < 0? loss+= value : profit += value // user sold - db price is (+) => profit value ELSE lost value
        //add to CASH balance
        let current_cash = Number(user_holding_cash[0].cost_basis)
        let new_cash = current_cash + (price*quantity);
        let user_holding_sell_cash = await db.helpers.updateUserHolding(user, "USD", 1, new_cash)
    }

    //DO something with total 
    console.log("profit: " + profit)
    console.log("loss: " + loss)
    const results = profit + loss; //if (-) total loss ELSE total profit
    console.log("Overall return: " + results)
    res.status(204).send();
})

app.get("/ranking", async (req, res, next) => {
    const usersArray = [];

    const result = await db.helpers.distinctUserFromHoldings()
    result.map(row => {
        const user = {
            userid: row.userid,
            value: 0
        };
        
        usersArray.push(user);
        
    });

    //yesterday date, api limited to the day before
    const yesterday = moment(new Date(new Date().setDate(new Date().getDate()-1))).format("yyyy-MM-DD")

    for (var userIndex in usersArray){
        var userid = usersArray[userIndex].userid;
        const holdings = await db.helpers.getAllUserHoldings(userid)
        var holdingsArray = [];
        holdings.map(hold => {
            const user = {
                symbol: hold.symbol
            };
            
            holdingsArray.push(hold);
            
        });
        console.log("holdings: " + JSON.stringify(holdings))
        let objIndex = usersArray.findIndex(obj => obj.userid == userid);
        for (const symbolIndex in holdingsArray) {
            var symbol = holdingsArray[symbolIndex].symbol;

            if(symbol !== 'USD') {
                var yesterdayClosing = await db.helpers.getSecurityHistory(symbol, yesterday)
                //Do not have the closing price in cache yet, call api
                if(JSON.stringify(yesterdayClosing) === '[]') {
                    let data = await api.polygonApiHelpers.getStockOpenClose(symbol, yesterday)
                    //Run of of credits, will create security history closing price entry of value 0
                    if (data.status == "NOT_FOUND" || data.status == "ERROR") {
                        const error = createHttpError(500, "Internal Server error, out of credits", {
                            headers: {
                                "X-Custom-Header": "Value"
                            }
                        });
                        return next(error);
                    } 

                    p = await db.helpers.addSecurityHistory(symbol, yesterday, data.open, data.close)
                    yesterdayClosing = await db.helpers.getSecurityHistory(symbol, yesterday)
                }
                let closingPrice = Number(yesterdayClosing[0].price_close)

                const userHolding = await db.helpers.getUserHolding(userid, symbol)
                let quantity = Number(userHolding[0].quantity);
                let cost_basis = Number(userHolding[0].cost_basis);
                
                let value = (closingPrice - cost_basis) * quantity
                usersArray[objIndex].value += value;
            }
        };

    }

    for (let i = 0; i < usersArray.length; i++) {
        console.log(usersArray[i].userid + " " + usersArray[i].value);
    }

    res.status(200).json(usersArray)

})

app.get('/currency/list', async (req, res) => {
    const data = await db.helpers.getCurrencyList()
    res.status(200).json(data)
})

app.get('/currency/ratelist', async (req, res) => {
    const data = await db.helpers.getCurrencyRateList()
    res.status(200).json(data)
})

app.get('/user/holdings', isLoggedIn, async (req, res) => {
    let user;
    if(req.session.user.role == 'manager'){
        user = req.query.username
    }
    else{
        user = req.session.user.username
    }
    const data = await db.helpers.getAllUserHoldings(user)
    res.status(200).json(data)
})

app.get('/manager/managedUsers', isLoggedIn, async (req, res) => {
    const _res = await db.helpers.getManagedUsers(req.session.user.username)
    res.status(200).json(_res)
})

app.post('/logout',isLoggedIn, async(req,res)=>{
    // Remove the session and login 
    req.session.destroy()
    res.status(200).json({ message: 'Logout successful' }); 
})

app.listen(PORT, '0.0.0.0')
console.log(`Running on port ${PORT}`)
