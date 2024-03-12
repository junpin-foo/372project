const express = require('express')
const api = require('./Polygon/apiHelpers')
const db = require('./models/database')
const port = 8080;
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors({
    origin: "*", // allow all origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.post("/submitTransactionForm", async (req, res) => {
    //User form data
    let transaction = req.body.transaction //Bought OR Sold
    let ticker_symbol = req.body.tickerSymbol
    let ticker_class = req.body.tickerClass
    let ticker_currency = req.body.tickerCurrency
    let quantity = req.body.quantity
    let price = req.body.price
    let date = req.body.date

    console.log(req.body)

    //Insert into securities table if not exist
    await db.helpers.addSecurities(ticker_symbol, ticker_class, ticker_currency)

    //Check if we have this ticker closing price cached in DB
    let p = await db.helpers.getSecurityHistory(ticker_symbol, date)
    if(JSON.stringify(p) === '[]') {
        //Do API call if not found
        let data = await api.polygonApiHelpers.getStockOpenClose(ticker_symbol, date)
        //Add into DB for cache
        p = await db.helpers.addSecurityHistory(ticker_symbol, date, data.open, data.close, data.high, data.low) //temp for change_abs and change_pct
    }

    //Do calculation
    let profit = 0;
    let loss = 0;
    let value = (quantity * price) - (quantity * p[0].price_close); //user bought price - closing price in DB
    console.log("value: " + value)
    if(transaction == "buy") {
        value > 0? loss+= value : profit += (value * -1) // user bought - db price is (+) => lost value ELSE profit value
    } else{
        value < 0? loss+= value : profit += value // user sold - db price is (+) => profit value ELSE lost value
    }

    //DO something with total 
    console.log("profit: " + profit)
    console.log("loss: " + loss)
    const results = profit + loss; //if (-) total loss ELSE total profit
    console.log("Overall return: " + results)
    //Save RESULT TO USER DATA
    res.redirect("http://localhost:3000/dashboard")
})

app.listen(port, ()=>  console.log(`listening to ${port}`));
