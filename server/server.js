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
    //Random string
    secret: '764f7f2d6497c0d87d1dba58ac2d8e1d',
    resave: false,
    saveUninitialized: false,
    maxAge: 1000*60*60*60, 
    cookie:{
        secure:false

    }
}))


function isLoggedIn(req, res, next) {
    if (req.session.user) {
        next()
    }
    res.send("403: Access Forbidden")
}
app.get('/getAllUsers', async(req,res) => {
    var users = (await db.helpers.getAllUsers())
    res.json(users)
})

app.post('/signup', async(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const manager = req.body.manager;
    const role = req.body.role;
    
    if (manager == ""){
        (await db.helpers.addUserNoManager(username, role,password,manager))
    }else{
        (await db.helpers.addUser(username, role,password,manager))
    }

    res.status(200).json({ message: 'Signup successful' }); 
})
app.post('/login', async(req,res) => {

    const username = req.body.username;
    const password = req.body.password;
    user = {username: username, password: password}
    var dataUser = (await db.helpers.getUser(username))

    if(dataUser.length != 0){

        dataUser = dataUser[0]
        const dbUsername = dataUser["userid"]
        var dbPass = dataUser["password_hash"]

        if(username=== dbUsername && bcrypt.compareSync(password, dbPass)){
            
            req.session.user = {...user, role: dataUser["role_name"]}
            res.status(200).json({ message: dataUser["role_name"]}); 
        }
        else {
            res.status(401).json({ error: 'Invalid password' });
        }
    }else{
        res.status(401).json({ error: 'Invalid username' });
    }
})

app.post("/submitMoneyForm", isLoggedIn, async (req, res, next) => {
    //User form data
    let transaction = req.body.transaction //withdraw / deposit
    let currency = req.body.currency
    let amount = Number(req.body.amount)

    let user = req.session.user.username

    console.log(req.body)

    //Covert CAD to USD
    if(currency == "CAD") {
        amount = Number((amount / 1.36).toFixed(2));
    }

    //**Ensure cash is auto created when user created**
    //symbol = USD/CAD, Quantity = 1, cash_basis = value
    let user_holding_cash = await db.helpers.getUserHolding(user, "USD")

    //If no CASH entry create one
    if(JSON.stringify(user_holding_cash) === '[]') {
        //Initialize new entry - for cash
        user_holding_cash = await db.helpers.addUserHolding(user, "USD", 1, 0, "USD")
    }

    if(transaction == "deposit") {
        let current_cash = Number(user_holding_cash[0].cost_basis)
        console.log("Amount:" + amount)
        console.log("current cash:" + current_cash)
        let new_cash = Number((current_cash + amount).toFixed(2));
        let user_holding_sell_cash = await db.helpers.updateUserHolding(user, "USD", 1, new_cash)

    } 
    else if (transaction == "withdraw") {
        let current_cash = Number(user_holding_cash[0].cost_basis)
        console.log("Amount:" + amount)
        console.log("current cash:" + current_cash)
        let new_cash = Number((current_cash - amount).toFixed(2));
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

app.post("/submitTransactionForm", isLoggedIn, async (req, res, next) => {
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

    //Call Polygon api to check if symbol is valid
    const today = moment(new Date()).format("YYYY-MM-DD")
    let data = await api.polygonApiHelpers.getStockSnapshot(ticker_symbol)
    if (data.tickers.length == 0 || data.status == "ERROR") {
        const error = createHttpError(406, "Invalid Symbol!", {
            headers: {
                "X-Custom-Header": "Value"
            }
        });
        return next(error);
    }

    //Insert into securities table if not exist
    await db.helpers.addSecurities(ticker_symbol, ticker_class, "USD")

    //Check if we have this ticker closing price cached in DB
    let p = await db.helpers.getSecurityHistory(ticker_symbol, date)
    if(JSON.stringify(p) === '[]') {
        //Add into DB for cache
        p = await db.helpers.addSecurityHistory(ticker_symbol, date, data.tickers[0].day.o, data.tickers[0].day.c)
    }

    let user_holding = await db.helpers.getUserHolding(user, ticker_symbol)
    //**Ensure cash is auto created when user created**
    //symbol = USD/CAD, Quantity = 1, cash_basis = value
    let user_holding_cash = await db.helpers.getUserHolding(user, "USD")

    //If no CASH entry create one
    if(JSON.stringify(user_holding_cash) === '[]') {
        //Initialize new entry - for cash
        user_holding_cash = await db.helpers.addUserHolding(user, "USD", 1, 0, "USD")
    }

    //User does not hold this symbol yet
    if(JSON.stringify(user_holding) === '[]') {
        //Initialize new entry - update on buy/sell later
        user_holding = await db.helpers.addUserHolding(user, ticker_symbol, 0, 0, "USD")
    }

    //Do profit/loss calculation
    let profit = 0; //positive number
    let loss = 0; //nagtive number
    if(ticker_currency == "CAD") {
        price = Number((price / 1.36).toFixed(2));
    }
    console.log("price: " + price )
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
            let new_cost_basis = (((current_cost_basis*current_quantity) + (price*quantity)) / new_quantity).toFixed(2);
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

app.get("/ranking", isLoggedIn, async (req, res, next) => {
    const usersArray = [];

    const result = await db.helpers.distinctUserFromHoldings()
    result.map(row => {
        const user = {
            userid: row.userid,
            value: 0
        };
        
        usersArray.push(user);
        
    });

    //today date, api limited to the day before
    const today = moment(new Date()).format("YYYY-MM-DD")

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

            if(symbol !== 'USD' && symbol !== 'CAD') {
                var todayClosing = await db.helpers.getSecurityHistory(symbol, today)

                let data = await api.polygonApiHelpers.getStockSnapshot(symbol)
                p = await db.helpers.addSecurityHistory(symbol, today, data.tickers[0].day.o, data.tickers[0].day.c)
                todayClosing = await db.helpers.getSecurityHistory(symbol, today)

                let closingPrice = Number(data.tickers[0].day.c)

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

app.get('/currency/list', isLoggedIn,  async (req, res) => {
    const data = await db.helpers.getCurrencyList()
    res.status(200).json(data)
})

app.get('/currency/ratelist', isLoggedIn,  async (req, res) => {
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
