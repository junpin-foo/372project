const express = require('express')
const api = require('./Polygon/apiHelpers')
const db = require('./models/database')
const PORT = 3001;
const cors = require('cors')
const session = require('express-session')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors({
    origin: "*", // allow all origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }))

app.use(session({
    name: 'nsession',
    secret: 'secret_string',
    resave: false,
    saveUninitialized: false,
    maxAge: 1000*60*60, 
}))

app.post('/login', async(req,res) => {
    // Temp Password 
    // todo replace with db call 
    var dbPass = "password"
    
    const {username, password} = req.body
    console.log(await db.helpers.getUser(username))
    user = {username: username, password: password}
    

    // If successful and the password matches return 200 to frontend
    if(username=== 'user@gmail.com' && password === dbPass){
        
        req.session.user = user
        res.status(200).json({ message: 'Login successful' }); 
    }
    else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
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

    let user = "user"//req.session.user

    console.log(req.body)

    //Insert into securities table if not exist
    await db.helpers.addSecurities(ticker_symbol, ticker_class, ticker_currency)

    //Check if we have this ticker closing price cached in DB
    let p = await db.helpers.getSecurityHistory(ticker_symbol, date)
    if(JSON.stringify(p) === '[]') {
        //Do API call if not found
        let data = await api.polygonApiHelpers.getStockOpenClose(ticker_symbol, date)
        //Add into DB for cache
        p = await db.helpers.addSecurityHistory(ticker_symbol, date, data.open, data.close)
    }

    let user_holding = await db.helpers.getUserHolding(user, ticker_symbol)
    //**Ensure cash is auto created when user created**
    //symbol = USD/CAD, Quantity = 1, cash_basis = value
    let user_holding_cash = await db.helpers.getUserHolding(user, "USD")
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
            const error = new Error("Insufficient funds")
            error.statusCode = 500;
            return next(error)
            // res.status(401).json({ error: 'Insufficient funds' });
        }
    } else{
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

app.post('/logout', async(req,res)=>{
    // Remove the session and login 
    req.session.destroy()
    res.status(200).json({ message: 'Logout successful' }); 
})

app.listen(PORT, '0.0.0.0')
console.log(`Running on port ${PORT}`)
